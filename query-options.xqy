xdmp:document-insert("/Default/bugtrack/rest-api/options/default.xml", 
<options xmlns="http://marklogic.com/appservices/search">
<search-option>unfiltered</search-option>
<quality-weight>0</quality-weight>
<constraint name="kind">
   <range type="xs:string">
      <element ns="" name="kind"/>
    </range>
  </constraint>
  <constraint name="id">
   <range type="xs:string">
      <element ns="" name="id"/>
    </range>
  </constraint>
   <constraint name="createdAt">
   <range type="xs:string">
      <element ns="" name="createdAt"/>
    </range>
  </constraint>
   <constraint name="modifiedAt">
   <range type="xs:string">
      <element ns="" name="modifiedAt"/>
    </range>
  </constraint>
   <constraint name="status">
   <range type="xs:string">
      <element ns="" name="status"/>
    </range>
  </constraint>
   <constraint name="submittedBy">
   <range type="xs:string">
      <element ns="" name="submittedBy"/>
    </range>
  </constraint>
   <constraint name="assignTo">
   <range type="xs:string">
      <element ns="" name="assignTo"/>
    </range>
  </constraint>
   <constraint name="category">
   <range type="xs:string">
      <element ns="" name="category"/>
    </range>
  </constraint>
   <constraint name="priority">
   <range type="xs:string">
      <element ns="" name="priority"/>
    </range>
  </constraint>
  <constraint name="severity">
  <range type="xs:string">
     <element ns="" name="severity"/>
   </range>
 </constraint>
   <constraint name="version">
   <range type="xs:string">
      <element ns="" name="version"/>
    </range>
  </constraint>
   <constraint name="platform">
   <range type="xs:string">
      <element ns="" name="platform"/>
    </range>
  </constraint>
   <constraint name="fixedin">
   <range type="xs:string">
      <element ns="" name="fixedin"/>
    </range>
  </constraint>
   </options>
  )