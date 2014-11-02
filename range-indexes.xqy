xquery version "1.0-ml";

  import module namespace admin = "http://marklogic.com/xdmp/admin" 
		  at "/MarkLogic/admin.xqy";
		
  let $elements :=  ("kind","id", "createdAt", "modifiedAt", "status", 
                      "submittedBy", "assignTo", "category", "priority", 
                      "severity", "version", "platform", "fixedin")
  for $element in $elements
  let $config := admin:get-configuration()
  let $dbid := xdmp:database("bugtrack")
  let $rangespec := admin:database-range-element-index("string", "", $element, "http://marklogic.com/collation/", fn:false() )
  let $config := admin:database-add-range-element-index($config, $dbid, $rangespec)
  return admin:save-configuration($config);


  import module namespace admin = "http://marklogic.com/xdmp/admin" 
      at "/MarkLogic/admin.xqy";

  let $paths := ("/submittedBy/username", "/submittedBy/name", "/assignTo/username", "/assignTo/name", "/priority/level", "/priority/title" )
  for $path in $paths
  return
  let $config := admin:get-configuration()
  let $dbid := xdmp:database("bugtrack")
  let $pathspec := admin:database-range-path-index($dbid, "string", $path, "http://marklogic.com/collation/", fn:false(), "ignore")
  let $config := admin:database-add-range-path-index($config, $dbid, $pathspec)
  return
  admin:save-configuration($config)
   