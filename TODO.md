# TODO:

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

