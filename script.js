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
        $(li).append(`<button id="${count}">Delete</button>`);
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
     * Posts new contact to online storage
     *
     * @param newContact
     */
    function postDataOnline(newContact){
        //Add to online storage
        $.post(`http://localhost:3000/contacts`, newContact);
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

         postDataOnline(newContact);


       // : Create contact (li element)
         const newContactItem = createContact(newContact);

       // : Append contact to ul#contactList
         $(`#contactList`).append(newContactItem);
     }
  }


    /**
     * delete contact from json
     * @param contactToDelete
     */
    function deleteData(contactToDelete){
        try {
            $.getJSON('http://localhost:3000/contacts', function (data) {
                console.log(data);
                console.log(contactToDelete);
                data.splice(contactToDelete, 1);
            })
        }
        catch(er){
            console.log(er);
            alert(`Please wait till you are online to make deletions.`)
        }
    }

    /**TODO: delete content off online server
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
            $(result.rows).each(function () {
                // : Create contacts for each record
                const savedContact = createContact(this.doc);
                // : Append contacts (li elements) to ul#contactList
                $(`#contactList`).append(savedContact);
            });
            $(`button`).addClass(`btn btn-default btn-xs`);
        }).catch(function (err) {
            console.log(`error loading saved contacts`);
            console.log(err);
        });
    }

    function loadContactsOnline(){
        console.log("hello!");
        try {
            $.getJSON('http://localhost:3000/contacts', function (data) {
                console.log(data);
                console.log("test");
                $.each(data, function (k, v) {
                    console.log("test Loop");
                    console.log(k);
                    console.log(v);
                    const savedContact = createContact(v);
                    console.log(savedContact);
                    $(`#contactList`).append(savedContact);
                });
                $(`button`).addClass(`btn btn-default btn-xs btn-danger delete`);
                //attach delete handler
                $(`.delete`).on(`click`, handleContactDelete);
            });
        }
        catch (ex){
            loadContactsOffline();
            console.log(ex);
        }
    }

    //TODO: catch error and load offline if needed.
    loadContactsOnline();



  // : Add submit event listener to form#contactForm and use handleNewContactSubmit
    $(`#contactForm`).on(`submit`, handleNewContactSubmit);

});
