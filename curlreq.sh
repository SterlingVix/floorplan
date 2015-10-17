#!/bin/bash

#     --header "Host: badgepickup.net" 
#     --header "Content-Type: text/xml; charset=utf-8" 
#     --header "Content-Length: length" 
#     --header "SOAPAction: http://badgepickup.net/GetAllData" 
#     
#curl --header "Content-Type: application/soap+xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/GetAllData/webservice.asmx
#curl --header "Content-Type: application/soap+xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/webservice.asmx

#curl --header "content-type: text/soap+xml; charset=utf-8"--data @sample.xml http://$HOSTNAME:$PORT/$SOMEPATH


#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/webservice.asmx
#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/webservice.asmx?GetAllData
#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/webservice.asmx?op=GetAllData
#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/GetAllData
#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/GetAllData/webservice.asmx
#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/GetAllData/webservice.asmx?GetAllData
#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "Content-Length: length" --header "SOAPAction: http://badgepickup.net/GetAllData" --data @soap_request.xml http://badgepickup.net/GetAllData/webservice.asmx?op=GetAllData

spacer="|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"

curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/webservice.asmx
              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/webservice.asmx?HelloWorld
              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/webservice.asmx?op=HelloWorld
              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/HelloWorld
#              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/HelloWorld?HelloWorld
#              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/HelloWorld?op=HelloWorld
#              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/HelloWorld/webservice.asmx
#              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/HelloWorld/webservice.asmx?HelloWorld
#              echo "" && echo "" && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo $spacer && echo "" && echo ""

#curl --header "Host: badgepickup.net" --header "Content-Type: text/xml; charset=utf-8" --header "SOAPAction: http://badgepickup.net/HelloWorld" --data @soap_request_hello_world.xml http://badgepickup.net/HelloWorld/webservice.asmx?op=HelloWorld
