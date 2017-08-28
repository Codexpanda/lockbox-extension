/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const LIST_ENTRIES_STARTING = Symbol("LIST_ENTRIES_STARTING");
export const LIST_ENTRIES_COMPLETED = Symbol("LIST_ENTRIES_COMPLETED");

export const ADD_ENTRY_STARTING = Symbol("ADD_ENTRY_STARTING");
export const ADD_ENTRY_COMPLETED = Symbol("ADD_ENTRY_COMPLETED");

export const UPDATE_ENTRY_STARTING = Symbol("UPDATE_ENTRY_STARTING");
export const UPDATE_ENTRY_COMPLETED = Symbol("UPDATE_ENTRY_COMPLETED");

export const REMOVE_ENTRY_STARTING = Symbol("REMOVE_ENTRY_STARTING");
export const REMOVE_ENTRY_COMPLETED = Symbol("REMOVE_ENTRY_COMPLETED");

export const SELECT_ENTRY_STARTING = Symbol("SELECT_ENTRY_STARTING");
export const SELECT_ENTRY_COMPLETED = Symbol("SELECT_ENTRY_COMPLETED");

export const START_NEW_ENTRY = Symbol("START_NEW_ENTRY");
export const CANCEL_NEW_ENTRY = Symbol("CANCEL_NEW_ENTRY");

// The action ID is used to correlate async actions with each other (i.e.
// FOO_STARTING and FOO_COMPLETED).
let nextActionId = 0;

export function listEntries() {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(listEntriesStarting(actionId));

    const response = await browser.runtime.sendMessage({
      type: "list_entries",
    });
    dispatch(listEntriesCompleted(actionId, response.entries));
  };
}

function listEntriesStarting(actionId) {
  return {
    type: LIST_ENTRIES_STARTING,
    actionId,
  };
}

function listEntriesCompleted(actionId, entries) {
  return {
    type: LIST_ENTRIES_COMPLETED,
    actionId,
    entries,
  };
}

export function addEntry(details) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(addEntryStarting(actionId, details));

    const response = await browser.runtime.sendMessage({
      type: "add_entry",
      entry: details,
    });
    dispatch(addEntryCompleted(actionId, response.entry));
  };
}

export function addedEntry(entry) {
  return addEntryCompleted(undefined, entry);
}

function addEntryStarting(actionId, entry) {
  return {
    type: ADD_ENTRY_STARTING,
    actionId,
    entry,
  };
}

function addEntryCompleted(actionId, entry) {
  return {
    type: ADD_ENTRY_COMPLETED,
    actionId,
    entry,
  };
}

export function updateEntry(entry) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(updateEntryStarting(actionId, entry));

    const response = await browser.runtime.sendMessage({
      type: "update_entry",
      entry,
    });
    dispatch(updateEntryCompleted(actionId, response.entry));
  };
}

export function updatedEntry(entry) {
  return updateEntryCompleted(undefined, entry);
}

function updateEntryStarting(actionId, entry) {
  return {
    type: UPDATE_ENTRY_STARTING,
    actionId,
    entry,
  };
}

function updateEntryCompleted(actionId, entry) {
  return {
    type: UPDATE_ENTRY_COMPLETED,
    actionId,
    entry,
  };
}

export function removeEntry(id) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(removeEntryStarting(actionId, id));

    await browser.runtime.sendMessage({
      type: "remove_entry",
      id,
    });
    dispatch(removeEntryCompleted(actionId, id));
  };
}

export function removedEntry(id) {
  return removeEntryCompleted(undefined, id);
}

function removeEntryStarting(actionId, id) {
  return {
    type: REMOVE_ENTRY_STARTING,
    actionId,
    id,
  };
}

function removeEntryCompleted(actionId, id) {
  return {
    type: REMOVE_ENTRY_COMPLETED,
    actionId,
    id,
  };
}

export function selectEntry(id) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(selectEntryStarting(actionId, id));
    const response = await browser.runtime.sendMessage({
      type: "get_entry",
      id,
    });
    dispatch(selectEntryCompleted(actionId, response.entry));
  };
}

function selectEntryStarting(actionId, id) {
  return {
    type: SELECT_ENTRY_STARTING,
    actionId,
    id,
  };
}

function selectEntryCompleted(actionId, entry) {
  return {
    type: SELECT_ENTRY_COMPLETED,
    actionId,
    entry,
  };
}

export function startNewEntry() {
  return {
    type: START_NEW_ENTRY,
  };
}

export function cancelNewEntry() {
  return {
    type: CANCEL_NEW_ENTRY,
  };
}