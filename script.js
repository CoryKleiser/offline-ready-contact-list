"use strict";
//Having issues in Safari when "use strict"
$(document).ready(function(){



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
    const li = $(`<li>&nbsp;&nbsp;</li>`);
    $(li).append(`<strong>${contact.name}</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
    $(li).append(`${contact.phone}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
    $(li).append(`<em>${contact.email}</em>&nbsp;&nbsp;`);
    $(li).append(`<button class="delete">Delete</button>`);
        //TODO: btn classes not being applied to last instance
    $(`.delete`).addClass(`btn btn-default btn-xs`)
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

    function deleteData(contactToDelete){
        const json = 'http://localhost:3000/contacts';
        console.log(json);
        const key = contactToDelete;
        console.log(key);
        delete json[key]
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
     * deletes selected contact
     */
    function handleContactDelete(){
        let deletion = $(`input[name="contacts"]:checked`).val();
        console.log(deletion);
        deletion = deletion - 1;
        deleteData(deletion);
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
            });
        }
        catch (er){
            loadContactsOffline();
            console.log(er);
        }
    }

    //TODO: catch error and load offline if needed.
    loadContactsOnline()



  // : Add submit event listener to form#contactForm and use handleNewContactSubmit
    $(`#contactForm`).on(`submit`, handleNewContactSubmit);
    $(`#delete`).click(handleContactDelete);
});
