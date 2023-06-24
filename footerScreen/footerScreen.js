import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class FooterScreen extends NavigationMixin(LightningElement) {
     disabled;
     valFromParent;
    @api get disabledNext() {
        return this.valFromParent;
    }
    set disabledNext(value) {
        this.setAttribute('disabledNext', value);
        this.valFromParent = value;
        this.handleValueChange(value);    }
    handleValueChange(value) {
        if(this.valFromParent > 100){
            this.disabled = true;
        }
        else{
            this.disabled = false;
        }
    }
    handleClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '0012v00003L1NrJAAV',
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
}
}