srtmove-js
==========

Online version
---------------
An online version is hosted on the github pages of this project:
http://lovasoa.github.io/srtmove-js/srtmove.html (in french)


Technical informations
------------------------
All the work is done on the client side, so the page also works offline.

The file is read with **File API** in javascript, and saved with the **download attribute** of the html anchor element.

### SRT file format
    1
    00:00:01,000 --> 00:00:01,210
    This subtitle has two lines
    And will appear during 210 milliseconds
    
(see SRT file format informations on wikipedia http://en.wikipedia.ork/wiki/subrib)
