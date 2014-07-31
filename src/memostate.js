/*
For any page element that should have it's state remembered
add a data-memostate field which is a space separated list of
attribute names whose values that should be looked
for on page load (in local storage), and which should also be 
recorded whenever there is a change.
*/

var rdfx = rdfx ? rdfx : {};

rdfx.memostate = ( function x() {
    "use strict";   

    var unique = function(x) {
        return window.location.pathname + "#" + x.id;
    }

    var store = function (id, value) {
        console.log("Storing", id, value);
        localStorage.setItem (id, value);
    }

    var retrieve = function (id) {
        console.log("Retrieving", id, localStorage.getItem(id));
        return localStorage.getItem(id);
    }

    // record the attribues for an element
    var storeAttributes = function(x) {
        console.log("yo",x);
        console.log("Dataset is ", x.dataset.memostate);
        if (x.dataset.memostate) {
            var attrs = x.dataset.memostate.split(" ");
            for (var i = attrs.length-1; i>=0; i--) {
                store(
                    unique(x) + "#" + attrs[i],
                    JSON.stringify(x[attrs[i]])
                );
            }
        }
    };

    var storeAfterEvent = function(x) {
        var t = x.currentTarget;
        setTimeout(
            // needs a little pause to allow the dom to update
            // using an observer would avoid this
            function() {
                storeAttributes(t)
            },
            100
        );
    }

    // maybe build this out with MutationObserver
    var addListeners = function(x) {
        x.addEventListener(
            "click",
            storeAfterEvent,
            true
        );
    }

    // retrieve the attributes for a particular element.
    var retrieveAttributes = function(x) {
        console.log(x);
        var attrs = x.dataset.memostate.split(" ");
        var name, val
        if (x.id) {
            for (var i = attrs.length-1; i>=0; i--) {
                name = attrs[i];
                try {
                    // needs a try to handle corrupt values
                    val = JSON.parse(
                        retrieve(
                            unique(x) + "#" + attrs[i]
                        )
                    );
                    x[name] = val;
                    if (name == "open") {
                        if (val === false) {
                            delete x[name];
                        }
                    }
                } catch (e) {console.log(e);}
            }
        }
    };

    var go = function () {
        var mems = document.querySelectorAll("[data-memostate]");
        for (var i = mems.length-1; i>=0; i--) {
            retrieveAttributes(mems[i]);
            addListeners(mems[i]);
        }

    };

    return { go : go };

})();

window.addEventListener("load", rdfx.memostate.go);
