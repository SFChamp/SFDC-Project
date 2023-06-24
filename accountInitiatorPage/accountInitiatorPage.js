import { LightningElement, track, wire, api } from 'lwc';
import getAccountInitiatorOptions from '@salesforce/apex/BusinessCreditCardApplicationController.getAccountInitiatorOptions';
import getEntityRecord from '@salesforce/apex/BusinessCreditCardApplicationController.getEntityRecord';
import {FlowAttributeChangeEvent, FlowNavigationNextEvent} from 'lightning/flowSupport';


export default class AccountInitiatorPage extends LightningElement {
@track accountInitiatorOptions = [];
@track selectedAccountInitiator = '';
@track accountInitiatorName = '';
@track accountInitiatorDOB = '';
@track accountInitiatorEmail = '';
@track accountInitiatorPhone = '';
@track accountInitiatorState = '';
@track accountInitiatorStreet = '';
@track accountInitiatorResidenceAddress = '';
@track showPersonalInfoSection = false;
@track showMaritalStatusSection = false;
@track housingStatus = '';
@track totalMonthlyHousingExpense = '';
@track showExpenseError = false;
@track maritalStatusOptions = [{label: 'Married', value: 'Married'}, {label: 'Unmarried', value: 'Unmarried'}, {label: 'Separated', value: 'Separated'}];
@track selectedMaritalStatus = '';
@track ownershipPercentage = '';
@track ownershipPercentageRequired = false;
@ api LWCInput;
@track GrossIncome;
@track Incometype;
@track Frequency;
isnextallow = false;
@wire(getAccountInitiatorOptions)
wiredAccountInitiatorOptions({ error, data }) {
    if (data) {
        this.accountInitiatorOptions = JSON.parse(data).map(option => {
                return { label: option.label, value: option.value };
            });
        console.log('accinit' +  this.accountInitiatorOptions);
    } else if (error) {
        console.error(error);
    }
}

handleAccountInitiatorChange(event) {
    this.selectedAccountInitiator = event.detail.value;
    getEntityRecord({entityId: this.selectedAccountInitiator})
        .then(result => {
            this.accountInitiatorName = result.name;
            this.accountInitiatorDOB = result.dob;
            this.accountInitiatorEmail = result.email;
            this.accountInitiatorPhone = result.phone;
            this.accountInitiatorResidenceAddress = result.residenceAddress;
            this.showPersonalInfoSection = true;
            this.accountInitiatorState = result.residenceState;
            this.accountInitiatorStreet = result.residenceStreet;
            if(result.residenceState == 'Wisconsin'){
                this.showMaritalStatusSection = true;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

handleMaritalStatusChange(event) {
    this.selectedMaritalStatus = event.detail.value;
}
get housingStatusOptions() {
        return [
            { label: 'Own', value: 'Own' },
            { label: 'Rent', value: 'Rent' },
            { label: 'Mortgage', value: 'Mortgage' },
            { label: 'Other', value: 'Other' }
        ];
    }
    get IncometypeOptions() {
        return [
            { label: 'Business', value: 'Business' },
            { label: 'Other Employment', value: 'Other Employment' },
            { label: 'Household or Family', value: 'Household or Family' },
            { label: 'Government Payments', value: 'Government Payments' },
            { label: 'Investments', value: 'Investments' },
            { label: 'Inheritence', value: 'Inheritence' }
        ];
    }
    get FrequencyOptions() {
        return [
            { label: 'Weekly', value: 'Weekly' },
            { label: 'Bi-Weekly', value: 'Bi-Weekly' },
            { label: 'Monthly', value: 'Monthly' },
            { label: 'Annually', value: 'Annually' }
        ];
    }
    GrossIncomeChange(event){
        this.GrossIncome = event.detail.value;
    }
    handleFrequencyChange(event){
        this.Frequency = event.detail.value;
    }
    handleIncometypeChange(event){
            this.Incometype = event.detail.value;
            let el = this. template.querySelector ('.GrossIncome');
            if ( this.Incometype > 99999999) {
            el.setCustomValidity ('Enter a Gross income below $999,99999');
            } else {
            el.setcustomValidity(' ');
            el.reportValidity ();
            }

    }

    handleHousingStatusChange(event) {
        this.housingStatus = event.detail.value;
    }

    handleTotalMonthlyHousingExpenseChange(event) {
        let value = event.detail.value;
        if (value.length > 6) {
            this.showExpenseError = true;
        } else {
            this.showExpenseError = false;
            this.totalMonthlyHousingExpense = value;
        }
    }
    get RolesOptions() {
        return [
            { label: 'Controlling Party', value: 'Controlling Party' },
            { label: 'Beneficial Owner', value: 'Beneficial Owner' }
        ];
    }
    handleOwnershipPercentageChange(event) { 
        this.ownershipPercentage = event.detail.value;
        if(this.ownershipPercentage > 100){
            this.isnextallow = true;
        }
    }
    handleRolOptionsChange(event) {
        this.RoleValue = event.detail.value;
    if (this.RoleValue == 'Controlling Party' || this.RoleValue == 'Beneficial Owner') {
        this.ownershipPercentageRequired = true;
    } else {
        this.ownershipPercentageRequired = false;
    }
    }
     get TitleOptions() {
        return [
            { label: 'Owner', value: 'Owner' },
            { label: 'Member', value: 'Member' }
        ];
    }

    TitleOptionsChange(event) {
        this.TitleValue = event.detail.value;
    }

}