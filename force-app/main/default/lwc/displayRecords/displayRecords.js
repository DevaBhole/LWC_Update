import { LightningElement, track, api } from "lwc";
import recordsFetch from "@salesforce/apex/getRecords.recordsFetch";
import { NavigationMixin } from "lightning/navigation";

export default class DisplayRecords extends LightningElement {
    @track fieldsSelected = [];
    @track gotTheRecords = false;
    @track recordsFet = [];
    @track recordsF = [];
    @track labelValue = [];
    @track columnsData = [];
    @track arrtoSend = [];
    @track columnsName = [];
    @track val;
  
    @api selectedFields;
    @api selectedFinalField;
    @api
    getSelectedFields(field) {
        this.fieldsSelected = [];
        console.log('old field array -->', JSON.stringify(this.fieldsSelected))
        this.fieldsSelected = field;
        console.log('new field array -->', JSON.stringify(this.fieldsSelected))
        console.log('Fields ' + field);
        console.log('Fields ' + JSON.stringify(field));
        // eslint-disable-next-line guard-for-in
    }
    @api
    getRefreshTable() {
        this.arrtoSend = [];
        this.columnsName = [];
        this.recordsFet = [];
    }
    @track actions = [
        { label: 'View', name: 'view' },
        { label: 'Edit', name: 'edit' },
        { label: 'Delete', name: 'delete' }
     ];
    @track selectObject = '';
    @api
    getRecord(objecName) {
        this.selectObject = objecName;
        console.log(objecName);
        recordsFetch({ objname: objecName, fields: this.fieldsSelected }).then(result => {
            if (result) {
                this.arrtoSend = [];
                // eslint-disable-next-line guard-for-in
                for (let index in this.fieldsSelected) {
                    this.arrtoSend.push(this.fieldsSelected[index])
                }
                this.val = this.arrtoSend;
                console.log('val' + this.val);
                // console.log(JSON.stringify(field));
                this.columnsName = [];
                console.log('before=>', JSON.stringify(this.columnsName));
                this.columnsName = this.val.map((value, index) => ({
                    label: this.val[index],
                    fieldName: value
                  
                }))
                this.columnsName = this.columnsName.concat( [
                    { type: 'action', typeAttributes: { rowActions: this.actions } }
                ] );
                console.log('after=>', JSON.stringify(this.columnsName));
                this.gotTheRecords = true;

                //this.recordsFet = [];
                this.recordsFet = result;
                console.log('RESULT ' + result);
                console.log("tttttttttt " + JSON.stringify(this.recordsFet))
            } else {
                console.log('error occurred');
            }
        })
            .catch(error => {
                console.log('Error on record method: ' + error.message);
            });

    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        console.log(actionName);
        const row = event.detail.row;
        console.log(row);
        this.recordId = row.Id;
        console.log(this.recordId);
        // eslint-disable-next-line default-case
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete':
                this.delAccount(row);
                break;
        }
    }
    

}
