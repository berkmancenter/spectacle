self.addEventListener("message", function( e ) {
    var data = e.data;

    if ( data.cmd == "capture") {
        var xhr = new XMLHttpRequest();
        
        xhr.open("POST", data.msg, false );
        xhr.send();
        
        //self.postMessage(xhr.status);
        
        if( xhr.status == 200 ) {
            self.postMessage( xhr.responseText );
        } else {
            self.postMessage( false );
        }
    } else {
        self.postMessage("Unknown command: " + data.msg);
    }
    
}, false);