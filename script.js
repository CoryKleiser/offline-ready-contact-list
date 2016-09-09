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


  //: Creates Contact Element
  function createContact(contact) {
    // : Create li element and return
    const li = $(`<li></li>`);
    $(li).append(contact.name, `<br>`, contact.email, `<br>`, contact.phone);
    return li;
  }


  //: Handles new contact submit
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

      //Add to offline storage
      localData.put(newContact).then(function (result) {
        console.log(`Successfully Posted to Offline Storage`);
      }).catch(function (err) {
        console.log(`ERROR:: Did not Post to Offline Storage`);
        console.log(err);
      });


      // : Create contact (li element)
      const newContactItem = createContact(newContact);

      // : Append contact to ul#contactList
      $(`#contactList`).append(newContactItem);
    }
  }

  // : Load contacts from offline storage (PouchDB)
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



  // : Add submit event listener to form#contactForm and use handleNewContactSubmit
  $(`#contactForm`).on(`submit`, handleNewContactSubmit);
});
