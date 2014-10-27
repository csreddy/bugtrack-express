'use strict';

var app = angular.module('bug.controllers', ['ui.bootstrap', 'angularFileUpload']);
app.constant('RESTURL', 'http://' + location.hostname + ':' + location.port);

app.controller('newBugCtrl', ['$scope', '$location', 'RESTURL', 'BugService', 'bugFactory', 'bugConfigFactory', 'Flash', 'User', 'loadConfig', 'getCurrentUser', 'bugId', 'FileUploader', '$http',

    function($scope, $location, RESTURL, BugService, bugFactory, bugConfigFactory, Flash, User, loadConfig, getCurrentUser, bugId, FileUploader, $http) {
        //$scope.test = 'controller works';

        // accordion interactions   
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
 
        $scope.config = {};
        $scope.config = loadConfig.data;
        $scope.submittedBy = getCurrentUser;

        $scope.selectedItem = {
            value: 0,
            label: ''
        };

        //  $scope.Wrapper = Serv;
        $scope.relatedTo = [];

        $scope.relatedTasks = [
            'Requirements task for',
            'Functional Spec task for',
            'Test Specification task for',
            'Test Automation task for',
            'Documentation task for',
            'Sub-task of'
        ];

        // $scope.setKind = function(kind) {
        //     $scope.kind = kind;
        // };

        $scope.submitted = false;

        $scope.setQuery = function(samplequery) {
            $scope.samplequery = samplequery;
        };
        $scope.setSampledata = function(sampledata) {
            $scope.sampledata = sampledata;
        };
        $scope.setStacktrace = function(stacktrace) {
            $scope.stacktrace = stacktrace;
        };

        $scope.setCategory = function(category) {
            $scope.category = category;
        };

        $scope.setAssignTo = function(assignTo) {
            $scope.assignTo = JSON.parse(assignTo);
        };

        $scope.setSeverity = function(severity) {
            $scope.severity = severity;
        };

        $scope.setPriority = function(priority) {
            $scope.priority = JSON.parse(priority);
        };

        $scope.setToFixIn = function(tofixin) {
            $scope.tofixin = tofixin;
        };

        $scope.setRelation = function(relation) {
            $scope.relation = relation;
        };

        $scope.setRelatedTo = function(relatedTo) {
            var tokenizedTaskIds = relatedTo.split(',');
            for (var i = 0; i < tokenizedTaskIds.length; i++) {
                tokenizedTaskIds[i] = parseInt(tokenizedTaskIds[i].replace(/ /g, ''));
            }
            $scope.relatedTo = tokenizedTaskIds;
        };

        $scope.setVersion = function(version) {
            $scope.version = version;
        };

        $scope.setPlatform = function(platform) {
            $scope.platform = platform;
        };

        $scope.setMemory = function(memory) {
            $scope.memory = memory;
        };

        $scope.setProcessors = function(processors) {
            $scope.processors = processors;
        };

        $scope.setNote = function(note) {
            $scope.note = note;
        };

        $scope.setHeadline = function(headline) {
            $scope.headline = headline;
        };

        $scope.setSupportDescription = function(supportDescription) {
            $scope.supportDescription = supportDescription;
        };

        $scope.setWorkaround = function(workaround) {
            $scope.workaround = workaround;
        };

        $scope.setPublishStatus = function(publishStatus) {
            $scope.publishStatus = publishStatus;
        };

        $scope.setTickets = function(setTickets) {
            var tokenizedTickets = setTickets.split(',');
            for (var i = 0; i < tokenizedTickets.length; i++) {
                tokenizedTickets[i] = parseInt(tokenizedTickets[i].replace(/ /g, ''));
            }
            $scope.tickets = (tokenizedTickets === null) ? [] : tokenizedTickets;
        };

        $scope.setCustomerImpact = function(customerImpact) {
            $scope.customerImpact = customerImpact;
        };


        //an array of files selected
        $scope.files = [];

        //listen for the file selected event
        $scope.$on('fileSelected', function(event, args) {
            $scope.$apply(function() {
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });

        //-------------------------------------------------------------------
        $scope.newBug = function() {
            var bug = {};
            bug.relatedTo = [];
            bug.tickets = [];

            bug.id = parseInt(bugId.data.total) + 1;
            bug.kind = $scope.kind || 'Bug';
            bug.createdAt = new Date();
            bug.modifiedAt = bug.createdAt;
            bug.status = $scope.config.status[1];
            bug.title = $scope.title;
            bug.submittedBy = $scope.submittedBy;
            bug.assignTo = $scope.assignTo;
            bug.description = $scope.description;
            bug.samplequery = $scope.samplequery;
            bug.sampledata = $scope.sampledata;
            bug.stacktrace = $scope.stacktrace;
            bug.category = $scope.category;
            bug.tofixin = $scope.tofixin;
            bug.severity = $scope.severity;
            bug.priority = $scope.priority;
            bug.relation = $scope.relation;
            bug.relatedTo = $scope.relatedTo;
            bug.clones = [];
            bug.version = $scope.version;
            bug.platform = $scope.platform || 'all';
            bug.memory = $scope.memory;
            bug.processors = $scope.processors;
            bug.note = $scope.note;
            bug.headline = $scope.headline;
            bug.supportDescription = $scope.supportDescription;
            bug.workaround = $scope.workaround;
            bug.publishStatus = $scope.publishStatus;
            bug.tickets.push($scope.tickets);
            bug.customerImpact = $scope.customerImpact;
            bug.changeHistory = [];
            bug.subscribers = [$scope.submittedBy, $scope.assignTo];
            bug.attachments = $scope.files || [];

             $http({
                url: '/new',
                method: 'POST',
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: function(data, getHeaders) {
                    var form = new FormData();
                    form.append('bug', angular.toJson(bug));
                    for (var i = 0; i < data.files.length; i++) {
                        console.log('FORM',data.files[i]);
                        form.append('file' + i, data.files[i]);
                    }
                    return form;
                },
                data: {
                    bug: bug,
                    files: $scope.files
                }
            }).success(function(data, status, headers, config) {
                Flash.addAlert('success', 'successssss');
            }).error(function(data, status, headers, config) {
                Flash.addAlert('danger', 'failed');
            });

            // .then(function(response) {
            //     Flash.addAlert('success', response.data);
            // }, function(response) {
            //     Flash.addAlert('danger', response.statusText);
            // });
        };


        //-------------------------------------------------------------------
        $scope.createNewBug = function() {
            if ($scope.bugForm.$valid) {
                // Submit as normal
                submitBug();
            } else {
                $scope.bugForm.submitted = true;
            }
        };



        function submitBug() {
            //  var bugId = Math.floor(Math.random() * 10000);
            var bug = {};
            bug.relatedTo = [];
            bug.tickets = [];

            bug.id = parseInt(bugId.data.total) + 1;
            bug.kind = $scope.kind || 'Bug';
            bug.createdAt = new Date();
            bug.modifiedAt = bug.createdAt;
            bug.status = $scope.config.status[1];
            bug.title = $scope.title;
            bug.submittedBy = $scope.submittedBy;
            bug.assignTo = $scope.assignTo;
            bug.description = $scope.description;
            bug.samplequery = $scope.samplequery;
            bug.sampledata = $scope.sampledata;
            bug.stacktrace = $scope.stacktrace;
            bug.category = $scope.category;
            bug.tofixin = $scope.tofixin;
            bug.severity = $scope.severity;
            bug.priority = $scope.priority;
            bug.relation = $scope.relation;
            bug.relatedTo = $scope.relatedTo;
            bug.clones = [];
            bug.version = $scope.version;
            bug.platform = $scope.platform || 'all';
            bug.memory = $scope.memory;
            bug.processors = $scope.processors;
            bug.note = $scope.note;
            bug.headline = $scope.headline;
            bug.supportDescription = $scope.supportDescription;
            bug.workaround = $scope.workaround;
            bug.publishStatus = $scope.publishStatus;
            bug.tickets.push($scope.tickets);
            bug.customerImpact = $scope.customerImpact;
            bug.changeHistory = [];
            bug.subscribers = [$scope.submittedBy, $scope.assignTo];
            bug.attachments = $scope.files || [];


            //var payload = {data: bug, files: $scope.files};


            var fd = new FormData();
            fd.append('data', angular.toJson(bug));
            for (var i = 0; i < $scope.files.length; i++) {
                //add each file to the form data and iteratively name them
                fd.append('file' + i, $scope.files[i]);
            }
            console.log($scope.files);

            var uri = bug.id + '.json';
            BugService.putDocument(uri, fd, $scope.submittedBy).then(function() {
                    console.log('bug details ', bug);
                    $location.path('/list');
                    Flash.addAlert('success', '<a href=\'/#/bug/' + bug.id + '\'>' + 'Bug-' + bug.id + '</a>' + ' was successfully created');

                },
                function(response) {
                    console.log(response);
                    Flash.addAlert('danger', response.statusText);
                }
            );
        }


        // text editor for bug descrition   
        //  $scope.descrizione = undefined;

    }
]);



app.controller('bugListCtrl', ['$scope', '$location', 'RESTURL', 'BugService', 'bugFactory', 'Flash', 'getCurrentUserBugs', 'getAllBugs', '$filter', 'getCurrentUser',

    function($scope, $location, RESTURL, BugService, bugFactory, Flash, getCurrentUserBugs, getAllBugs, $filter, getCurrentUser) {

        $scope.bugs = [];
        $scope.currentUser = getCurrentUser;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        // get all bugs on load
        $scope.bugList = getAllBugs.data.results;

        function getBugList() {
            // $scope.bugList = getCurrentUserBugs.data.results;            
            $scope.totalItems = $scope.bugList.length;
            $scope.bugList.sort(function(a, b) {
                //  console.log(a.uri);
                a = parseInt(a.uri.replace('.json', ''));
                b = parseInt(b.uri.replace('.json', ''));
                return (a - b);
            });

            function getBugDetails(begin, end) {
                $scope.bugs = [];
                angular.forEach($scope.bugList.slice(begin, end), function(bug) {
                    BugService.getBug(bug.uri).then(function(response) {
                        $scope.bugs.push(response.data);
                        // sort 
                        $scope.bugs.sort(function(a, b) {
                            return (a.id - b.id);
                        });

                    }, function() {
                        Flash.addAlert('danger', 'Oops! could not retrieve bugs');
                    });
                });
            }

            getBugDetails(0, $scope.itemsPerPage);


            $scope.goToBug = function(uri) {
                $location.path(uri);
            };

            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
                console.log('Page changed to: ' + $scope.currentPage);
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                getBugDetails(begin, end);
            };

            var orderBy = $filter('orderBy');
            $scope.order = function(predicate, reverse) {
                $scope.bugs = orderBy($scope.bugs, predicate, reverse);
            };

        }

        getBugList();


        $scope.$on('search', function(event, data) {
            $scope.bugList = data.searchResults;
            console.log($scope.bugList);
            getBugList();
        });


    }
]);


app.controller('bugViewCtrl', ['$scope', '$location', 'RESTURL', 'BugService', 'bugFactory', 'bugConfigFactory', 'Flash', 'getCurrentUser', 'bugId', '$q', 'modalService',

    function($scope, $location, RESTURL, BugService, bugFactory, bugConfigFactory, Flash, getCurrentUser, bugId, $q, modalService) {

        $scope.config = {};
        $scope.changes = {};
        $scope.updatedBy = getCurrentUser;
        $scope.showSubscribe = true;
        $scope.showUnsubscribe = false;


        var updateBug;
        var uri = $location.path().replace('/bug/', '') + '.json';

        bugConfigFactory.getConfig().then(function(response) {
            $scope.config = response.data;
            console.log('config: ', $scope.config);
        });

        BugService.getBug(uri).then(function(response) {
                console.log(response.data);

                $scope.bug = response.data;
                updateBug = response.data;
                console.log('updateBug', updateBug);

                // if the current user has already subscribed then show Unsubscribe else show Subscribe
                var subscribers = $scope.bug.subscribers;
                for (var i = 0; i < subscribers.length; i++) {
                    if (subscribers[i].username === getCurrentUser.username) {
                        $scope.showSubscribe = false;
                        $scope.showUnsubscribe = true;
                        break;
                    }
                }
                // if the current user is bug reporter or bug assignee then do not show subscribe/unsubscribe because 
                // they are subscribed default and cannot unsubscribe
                if (getCurrentUser.username === $scope.bug.assignTo.username || getCurrentUser.username === $scope.bug.submittedBy.username) {
                    $scope.showSubscribe = false;
                    $scope.showUnsubscribe = false;
                }

                // watch for status change   
                $scope.$watch('status', function() {
                    if ($scope.status !== undefined) {
                        var note = 'Status changed from ' + $scope.bug.status + ' to ' + $scope.status;
                        console.log(note);
                        $scope.changes.status = {
                            'from': $scope.bug.status,
                            'to': $scope.status
                        };
                    }
                }, true);

                // watch for priority change
                $scope.$watch('priority', function() {
                    if ($scope.priority !== undefined) {
                        var p = JSON.parse($scope.priority);
                        var note = 'Priority changed from ' + $scope.bug.priority.level + '-' + $scope.bug.priority.title + ' to ' + p.level + '-' + p.title;
                        console.log(note);
                        $scope.changes.priority = {
                            'from': $scope.bug.priority.level + '-' + $scope.bug.priority.title,
                            'to': p.level + '-' + p.title
                        };
                    }
                }, true);

                // watch for severity change
                $scope.$watch('severity', function() {
                    if ($scope.severity !== undefined) {
                        var note = 'Severity changed from ' + $scope.bug.severity + ' to ' + $scope.severity;
                        console.log(note);
                        $scope.changes.severity = {
                            'from': $scope.bug.severity,
                            'to': $scope.severity
                        };
                    }
                }, true);

                // watch for category change
                $scope.$watch('category', function() {
                    if ($scope.category !== undefined) {
                        var note = 'Category changed from ' + $scope.bug.category + ' to ' + $scope.category;
                        console.log(note);
                        $scope.changes.category = {
                            'from': $scope.bug.category,
                            'to': $scope.category
                        };
                    }
                }, true);

                // watch for version change
                $scope.$watch('version', function() {
                    if ($scope.version !== undefined) {
                        var note = 'Version changed from ' + $scope.bug.version + ' to ' + $scope.version;
                        console.log(note);
                        $scope.changes.version = {
                            'from': $scope.bug.version,
                            'to': $scope.version
                        };
                    }
                }, true);

                // watch for platform change
                $scope.$watch('platform', function() {
                    if ($scope.platform !== undefined) {
                        var note = 'Priority changed from ' + $scope.bug.platform + ' to ' + $scope.platform;
                        console.log(note);
                        $scope.changes.platform = {
                            'from': $scope.bug.platform,
                            'to': $scope.platform
                        };
                    }
                }, true);

                // watch for tofixin change
                $scope.$watch('tofixin', function() {
                    if ($scope.tofixin !== undefined) {
                        var note = 'To Fix in changed from ' + $scope.bug.tofixin + ' to ' + $scope.tofixin;
                        console.log(note);
                        $scope.changes.tofixin = {
                            'from': $scope.tofixin,
                            'to': $scope.tofixin
                        };
                    }
                }, true);

                // watch for fixedin change
                $scope.$watch('fixedin', function() {
                    if ($scope.fixedin !== undefined) {
                        var note = 'Fixed in changed from ' + $scope.bug.fixedin + ' to ' + $scope.fixedin;
                        console.log(note);
                        $scope.changes.fixedin = {
                            'from': $scope.bug.fixedin,
                            'to': $scope.fixedin
                        };
                    }
                }, true);

                // watch for assignTo change
                $scope.$watch('assignTo', function() {
                    if ($scope.assignTo !== undefined) {
                        var note = 'Bug re-assigned to ' + JSON.parse($scope.assignTo).name;
                        console.log(note);
                        $scope.changes.assignTo = {
                            'from': $scope.bug.assignTo,
                            'to': JSON.parse($scope.assignTo)
                        };
                    }
                }, true);
                // Flash.addAlert('success', 'opened ' + uri);
            },
            function(response) {
                if (response.status === 404) {
                    $location.path('/404');
                    Flash.addAlert('danger', 'bug not found');
                } else {
                    Flash.addAlert('danger', response.data.error.message);
                }

            });


        // update bug 
        $scope.updateBug = function() {
            var uri = $scope.bug.id + '.json';
            var updateTime = new Date();
            updateBug.status = $scope.status || $scope.bug.status;
            updateBug.assignTo = ($scope.assignTo === undefined) ? $scope.bug.assignTo : JSON.parse($scope.assignTo);
            // check if the user has already subscribed
            for (var i = 0; i < updateBug.subscribers.length; i++) {
                if (updateBug.subscribers[i].username === updateBug.assignTo.username) {
                    break;
                }
                // if user has not subscribed then subscribe at the last iteration
                if (i === updateBug.subscribers.length - 1) {
                    updateBug.subscribers.push(updateBug.assignTo);
                }
            }
            updateBug.category = $scope.category || $scope.bug.category;
            updateBug.tofixin = $scope.tofixin || $scope.bug.tofixin;
            updateBug.severity = $scope.severity || $scope.bug.severity;
            updateBug.priority = ($scope.priority === undefined) ? $scope.bug.priority : JSON.parse($scope.priority);
            updateBug.version = $scope.version || $scope.bug.version;
            updateBug.platform = $scope.platform || $scope.bug.platform;
            updateBug.fixedin = $scope.fixedin || $scope.bug.fixedin;
            if (Object.keys($scope.changes).length !== 0 || $scope.newcomment) {
                console.log($scope.newcomment);
                console.log($scope.updatedBy);
                updateBug.changeHistory.push({
                    'time': updateTime,
                    'updatedBy': $scope.updatedBy,
                    'change': $scope.changes,
                    'comment': $scope.newcomment
                });
                // clear text area after submit
                $scope.newcomment = '';
            }

            BugService.putDocument(uri, updateBug, updateBug.submittedBy).then(function() {

                    $scope.changes = {};
                    console.log('changes', $scope.changes);
                    //      console.log('updateBug', updateBug);
                    console.log('bug changed from ', updateBug);
                    console.log('bug changed to', $scope.bug);
                    Flash.addAlert('success', '<a href=\'/#/bug/' + $scope.bug.id + '\'>' + 'Bug-' + $scope.bug.id + '</a>' + ' was successfully updated');
                },
                function(response) {
                    Flash.addAlert('danger', response.data.error.message);
                }
            );
        };

        // clone bug 
        $scope.clone = function(id) {

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Clone',
                headerText: 'Clone Bug-' + id + '?',
                bodyText: 'Are you sure you want to clone this bug?'
            };

            console.log('cloned ' + id);
            var cloneTime = new Date();
            var newBugId = parseInt(bugId.data.total) + 1;
            var clonedBug = angular.copy($scope.bug);
            clonedBug.id = newBugId;
            clonedBug.cloneOf = id;
            clonedBug.clones = [];
            clonedBug.changeHistory.push({
                'time': cloneTime,
                'updatedBy': $scope.updatedBy,
                'comment': "<span class='label label-danger'><span class='glyphicon glyphicon-bullhorn'></span></span> Cloned from " + "<a href='#/bug/" + id + "'>Bug-" + id + "</a>"
            });

            if ($scope.bug.cloneOf) {
                Flash.addAlert('danger', "Cloning of cloned bug is not allowed. Clone the parent <a href='#/bug/" + $scope.bug.cloneOf + "'>Bug-" + $scope.bug.cloneOf + "</a>");
                // $location.path('/bug/' + id);
            } else {
                console.warn('clone of', $scope.bug.cloneOf);
                modalService.showModal({}, modalOptions).then(function(result) {
                    if ($scope.bug.clones) {
                        $scope.bug.clones.push(newBugId);
                    } else {
                        $scope.bug.clones = [newBugId];
                    }

                    var promises = [BugService.putDocument(newBugId + '.json', clonedBug, $scope.bug.submittedBy).then(),
                        BugService.putDocument(uri, $scope.bug, $scope.bug.submittedBy).then()
                    ];
                    $q.all(promises).then(function() {
                            console.log('bug details ', clonedBug);
                            //  console.log('----', $scope.updatedBy);
                            $location.path('/bug/' + newBugId);
                            Flash.addAlert('success', '<a href=\'/#/bug/' + clonedBug.id + '\'>' + 'Bug-' + clonedBug.id + '</a>' + ' was successfully cloned');
                        },
                        function(response) {
                            console.log(response);
                            Flash.addAlert('danger', response.data.error.message);
                        }
                    );
                });
            }
        };

        // subscribe to the bug
        $scope.subscribe = function() {
            var uri = $scope.bug.id + '.json';
            $scope.bug.subscribers.push($scope.updatedBy);
            BugService.putDocument(uri, $scope.bug, $scope.bug.submittedBy).then(function() {
                $scope.showSubscribe = false;
                $scope.showUnsubscribe = true;
                Flash.addAlert('success', 'You have subscribed to ' + '<a href=\'/#/bug/' + $scope.bug.id + '\'>' + 'Bug-' + $scope.bug.id + '</a>');
            }, function(response) {
                Flash.addAlert('danger', response.data.error.message);
            });
        };
        // unsubscribe to the bug
        $scope.unsubscribe = function() {
            var uri = $scope.bug.id + '.json';
            var subscribers = $scope.bug.subscribers;
            for (var i = 0; i < subscribers.length; i++) {
                if (subscribers[i].username === getCurrentUser.username) {
                    $scope.bug.subscribers.splice(i, 1);
                    break;
                }
            }
            BugService.putDocument(uri, $scope.bug, $scope.bug.submittedBy).then(function() {
                // if the current user is bug reporter or bug assignee then do not show subscribe/unsubscribe because 
                // they are subscribed default and cannot unsubscribe
                if (getCurrentUser.username === $scope.bug.submittedBy.username || getCurrentUser.username === $scope.bug.assignTo.username) {
                    $scope.showSubscribe = false;
                    $scope.showUnsubscribe = false;
                } else {
                    $scope.showSubscribe = true;
                    $scope.showUnsubscribe = false;
                }
                Flash.addAlert('success', 'You have unsubscribed from ' + '<a href=\'/#/bug/' + $scope.bug.id + '\'>' + 'Bug-' + $scope.bug.id + '</a>');
            }, function(response) {
                Flash.addAlert('danger', response.data.error.message);
            });
        };
    }
]);