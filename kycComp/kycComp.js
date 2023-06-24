import { LightningElement,api,track } from 'lwc';
import getEntityRecord from '@salesforce/apex/BusinessCreditCardApplicationController.getEntityRecord';

export default class KycComp extends LightningElement {
    @api accountId;
    @track selectedAccountInitiator = '';
    @track accountInitiatorName = '';
    @track accountInitiatorRole = '';
    @track accountInitiatorEmail = '';
    @track accountInitiatorPhone = '';

    handleAccountInitiatorChange(event) {
       // this.selectedAccountInitiator = event.detail.value;
        getEntityRecord({entityId: this.accountId})
            .then(result => {
                this.accountInitiatorName = result.name;
                this.accountInitiatorRole = result.role;
                this.accountInitiatorEmail = result.email;
                this.accountInitiatorPhone = result.phone;
            })
            .catch(error => {
                console.error(error);
            });
    }
}