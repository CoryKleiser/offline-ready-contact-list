// "use strict";
$(`document`).ready(function(){
  const inputName = $(`#inputName`);
  const inputEmail = $(`#inputEmail`);
  const inputPhone = $(`#inputPhone`);
  const emailValidate = /^(\S+@)+(\S*\.)?uc\.edu$/i;
  const phoneValidate = /^\+?[0-9]*(\([0-9]*\))?[0-9-]*[0-9]$/;
  //used for npm install //const PouchDB = require(`pouchdb`);
  const localData = new PouchDB(`contactList`);

  function createContact(contact) {
    // TODO: Create li element and return
    const li = $(`<li></li>`);
    $(li).append(contact.name, `<br>`, contact.email, `<br>`, contact.phone);
    return li;
  }

  function handleNewContactSubmit(ev) {
    ev.preventDefault();

    // TODO: Validate email and phone
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
      // TODO: Save to offline storage (localStorage, IndexedDB, PouchDB)
      const newContact = {
        _id: contactName,
        name: contactName,
        email: contactEmail,
        phone: contactPhone
      };
      console.log(newContact);
      localData.put(newContact).then(function (result) {
        console.log(`Successfully Posted to Offline Storage`);
      }).catch(function (err) {
        console.log(`ERROR:: Did not Post to Offline Storage`);
        console.log(err);
      });


      // TODO: Create contact (li element)
      const newContactItem = createContact(newContact);

      // TODO: Append contact to ul#contactList
      $(`#contactList`).append(newContactItem);
    }
  }

  // TODO: Load contacts from offline storage (localStorage, IndexedDB, PouchDB)
  localData.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    $(result.rows).each(function () {
      const savedContact = createContact(this.doc);
      $(`#contactList`).append(savedContact);
    });
  }).catch(function (err) {
    console.log(`error loading saved contacts`);
    console.log(err);
  });

  // TODO: Create contacts for each record

  // TODO: Append contacts (li elements) to ul#contactList

  // TODO: Add submit event listener to form#contactForm and use handleNewContactSubmit
  $(`#contactForm`).on(`submit`, handleNewContactSubmit);
});
