# TODO:



Modal popup: at this booth: (null) all




* View: Floorplan
* View: booth detail
* View: summary / event?
* View: log in?



* Event: open modal
* Event: close modal
* Event: pan floor plan (mousedrag, arrows?)
* Event: zoom floor plan (buttons, mousewheel, pinch?)
* Event: reserve booth? (set db flag)
* Event: submit form? (write db or e-mail)



* App: render views
* App: get expo data (AJAX)
* App: parse expo data
* App: async d/l & render (localstore?)

## App flowchart:


1) get login ???

2) authenticate ???

3) cookies ???

4) d/l floor plan data

      5a) render floor plan
        6a) bind events
      5b) d/l exhibitor data
        6b) parse / render exhibitor data

        {
          7a) render each booth's data
          7b) d/l each logo
        }

        OR

        {
          7) render all booth data
          8) d/l logos
          9) render logos
        }




`============================================================
`============================================================
`============================================================
`============================================================
                        FOR ALLAN
`============================================================
`============================================================
`============================================================
`============================================================

I recommend we deploy the code to the FTP at:

ftp://50.62.160.239/httpdocs/floorplan/

Because of CORS settings (https://www.veracode.com/blog/2014/03/guidelines-for-setting-security-headers), I'm not able to pull data from the server while testing this app. It's probably not worth trying to fix that - I'll just work with the dummy data, and we'll have to trust that the data will be well formed.

If you want to enable CORS, you might find this useful: 

https://msdn.microsoft.com/en-us/library/system.web.http.cors.enablecorsattribute(v=vs.118).aspx
http://www.codeguru.com/csharp/.net/net_asp/using-cross-origin-resource-sharing-cors-in-asp.net-web-api.html

I think you would add the CORS stuff to your web.config file, and I'd recommend you allow access to "http://sterlingvix.github.io" for easy testing.

But we don't need to mess with this at all.

Unfortunately I don't have any cell reception for the next week, but we can do a Skype or google chat if you want to catch up. We should talk about the level of server-side interactivity you want: if you want users to have profiles and authentication and login, if you want them to submit data through the web site, if so, if you want the server code to do something with that data. Etc.

I'm planning on pushing a big update fixing (hopefully) some of the interaction and enabling fetching of resources (the XML) from the server and parsing the data client-side.





`============================================================
`============================================================
`============================================================
`============================================================
                        CONVERSION
`============================================================
`============================================================
`============================================================
`============================================================

backgroundImageData:
    In: index.html
    Convert: .xml
    
window.dummyData:
    In: js file
    Convert: xml