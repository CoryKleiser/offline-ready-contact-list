"use strict";

function createContact(name, email, phone) {
  // TODO: Create li element and return
  const contactName = $(`<li></li>`);
  return contactName;
  const contactEmail = $(`<li></li>`);
  return contactPhone;
  const contactPhone = $(`<li></li>`);
  return contactPhone;
}

function handleNewContactSubmit(ev) {
  ev.preventDefault();

  // TODO: Validate email and phone

  // TODO: Save to offline storage (localStorage, IndexedDB, PouchDB)

  // TODO: Create contact (li element)

  // TODO: Append contact to ul#contactList
}

// TODO: Load contacts from offline storage (localStorage, IndexedDB, PouchDB)

// TODO: Create contacts for each record

// TODO: Append contacts (li elements) to ul#contactList

// TODO: Add submit event listener to form#contactForm and use handleNewContactSubmit
