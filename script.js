"use strict";
//Having issues in Safari when "use strict"
$(window).ready(function(){



  //: get input fields
  const inputName = $(`#inputName`);
  const inputEmail = $(`#inputEmail`);
  const inputPhone = $(`#inputPhone`);

  //:set validation regex
  const emailValidate = /^(\S+@)+(\S*\.)?uc\.edu$/i;
  const phoneValidate = /^\+?[0-9]*(\([0-9]*\))?[0-9-]*[0-9]$/;


  //used for npm install //const PouchDB = require(`pouchdb`);
    const localData = new PouchDB(`contactList`);
    const remoteData = new PouchDB('http://localhost:5984/contactlist');


    /*
     * get database info
     */
    localData.info().then(function (info) {
        console.log(info);
    });
    remoteData.info().then(function (info) {
        console.log(info);
    });

    //TODO: sync local db to online db
    //FIXME:
    var replicationHandler = localData.replicate.to(remoteData, {
        live: true,
        retry: true
    });

    replicationHandler.on('complete', function (info) {
        alert(`Cannot sync to your online storage. Please try again later`)
    }).on('paused', function (info) {
        console.log(info);
        console.log(`sync paused`);
    }).on('active', function (info) {
        // replication was resumed
    }).on('error', function (err) {
        replicationHandler.cancel();
    });



    /**
     * Creates new Contact Element
     *
     * @param contact
     * @returns {*|jQuery|HTMLElement}
     */
    function createContact(contact) {
    // : Create li element and return
        const count = $(`li`).length;
        console.log(count);
        const li = $(`<li>&nbsp;&nbsp;</li>`);
        $(li).append(`<strong>${contact.name}</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
        $(li).append(`${contact.phone}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
        $(li).append(`<em>${contact.email}</em>&nbsp;&nbsp;`);
        $(li).append(`<button id="${contact._id}">Delete</button>`);
            //TODO: btn classes not being applied to last instance

        return li;
    }


    /**
     * Posts new contact to offline storage
     *
     * @param newContact
     */
    function postDataOffline(newContact){
        //Add to offline storage
        localData.put(newContact).then(function (result) {
            console.log(`Successfully Posted to Offline Storage`);
        }).catch(function (err) {
            console.log(`ERROR:: Did not Post to Offline Storage`);
            console.log(err);
        });
    }




    /**
     * Handles new contact submit
     *
     * @param ev
     */
  function handleNewContactSubmit(ev) {
     ev.preventDefault();

     // : Validate email and phone
     const contactName = $(`[id="inputName"]`).val();
     const contactEmail = $(`[id="inputEmail"]`).val();
     const contactPhone = $(`[id="inputPhone"]`).val();
     if (!contactName) {
         alert(`Please enter your name.`);
     }
     else if (!emailValidate.test(contactEmail)) {
         alert(`Please enter valid email address.`);
     }
     else if (!phoneValidate.test(contactPhone)) {
         alert(`Please enter a valid phone number`);
     }
     else {
         // : Save to offline storage (PouchDB)
         const newContact = {
             _id: contactName,
             name: contactName,
             email: contactEmail,
             phone: contactPhone
         };
         console.log(newContact);

         postDataOffline(newContact);


       // : Create contact (li element)
         const newContactItem = createContact(newContact);

       // : Append contact to ul#contactList
         $(`#contactList`).append(newContactItem);
     }
  }


    /**
     * :delete data off local db
     * @param contactToDelete
     */
    function deleteData(contactToDelete) {
        //todo: take logs out
        console.log(`to be deleted: ${contactToDelete}`);
        localData.get(contactToDelete).then(function (doc) {
            console.log(doc);
            return localData.remove(doc._id, doc._rev);
        }).catch(function (er) {
            console.log(er);
            alert(`Error! Unable to delete contact!`);
        })
    }

    /**TODO: delete content off db
     * deletes contact
     */
    function handleContactDelete(ev){

        ev.preventDefault();
        console.log(ev);

        const deletion = $(ev.target);
        console.log(ev.target);
        console.log(deletion);
        const dataId = deletion.attr(`id`);
        console.log(dataId);
        deleteData(dataId);
        deletion.parent().remove();
    }

  // : Load contacts from offline storage (PouchDB)
    /**
     * Loads Contacts from online or offline storage.
     */
    function loadContactsOffline() {
        localData.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            console.log(result);
            $(result.rows).each(function () {
                // : Create contacts for each record
                const savedContact = createContact(this.doc);
                // : Append contacts (li elements) to ul#contactList
                $(`#contactList`).append(savedContact);
            });
            $(`button`).addClass(`btn btn-default btn-xs btn-danger delete`);
            //attach delete handler
            $(`.delete`).on(`click`, handleContactDelete);
        }).catch(function (err) {
            console.log(`error loading saved contacts`);
            console.log(err);
        });
    }



    // function loadContactsOnline(){
    //     console.log("hello!");
    //     try {
    //         $.getJSON('http://localhost:3000/contacts', function (data) {
    //             console.log(data);
    //             console.log("test");
    //             $.each(data, function (k, v) {
    //                 console.log("test Loop");
    //                 console.log(k);
    //                 console.log(v);
    //                 const savedContact = createContact(v);
    //                 console.log(savedContact);
    //                 $(`#contactList`).append(savedContact);
    //                 $(`.delete`).on(`click`, handleContactDelete);
    //             });
    //             $(`button`).addClass(`btn btn-default btn-xs btn-danger delete`);
    //             //attach delete handler
    //             $(`.delete`).on(`click`, handleContactDelete);
    //         });
    //     }
    //     catch (ex){
    //         loadContactsOffline();
    //         console.log(ex);
    //     }
    // }

    //TODO: catch error and load online/offline if needed.
    loadContactsOffline();


  // : Add submit event listener to form#contactForm and use handleNewContactSubmit
    $(`#contactForm`).on(`submit`, handleNewContactSubmit);

});
