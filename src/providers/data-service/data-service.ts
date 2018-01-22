import { Injectable } from '@angular/core';

declare function require(a);

@Injectable()
export class DataServiceProvider {

  db: any;

  constructor() {
    var PouchDB = require('pouchdb');
    this.db = new PouchDB('test');
  }

  async getDocumentsByPageSize(startKey: string, endKey: string, pageSize: number, descending: boolean) {
    let result = await this.db.allDocs({
      include_docs: true,
      startkey: startKey,
      endkey: endKey + '\ufff0',
      descending: descending,
      limit: pageSize + 1
    });
    let data = [];
    result.rows.map((row) => {
      data.push(row.doc);
    });
    return data;
  }

  async getDocumentsByKey(startKey: string, endKey?: string, descending?:boolean) {
    endKey = endKey ? endKey : startKey;
    descending = descending ? descending : false;
    let result = await this.db.allDocs({
      include_docs: true,
      startkey: startKey,
      endkey: endKey + '\ufff0',
      descending: descending
    });
    let data = [];
    result.rows.map((row) => {
      data.push(row.doc);
    });
    return data;
  }

  getDocument(documentId) {
    return this.db.get(documentId).then((data) => {
      return data;
    }).catch((err) => {
      return null;
    });
  }

  bulkDocuments(documents){
    this.db.bulkDocs(documents).catch((err) => {
      console.log(err);
    });
  }

  postDocument(document){
    this.db.post(document);
  }

  async putDocument(document) {
    this.getDocument(document._id).then((origDoc) => {
      if(origDoc) {
        document._rev = origDoc._rev; //Update conflict 409 without this line
        this.db.put(document).catch(error => {  console.log(error)  });
      } else {
        this.db.post(document).catch(error => {  console.log(error)  });
      }
    });
  }

  removeDocument(document) {
    this.db.remove(document).catch((err) => {
      console.log(err);
    });
  }
}
