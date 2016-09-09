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
    const li = $(`<li></li>`);
    $(li).append(contact.name, `<br>`, contact.email, `<br>`, contact.phone);
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

  // : Load contacts from offline storage (PouchDB)
    /**
     * Loads Contacts from online or offline storage.
     */
    function loadContacts() {
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

    loadContacts();

  // : Add submit event listener to form#contactForm and use handleNewContactSubmit
    $(`#contactForm`).on(`submit`, handleNewContactSubmit);
});
