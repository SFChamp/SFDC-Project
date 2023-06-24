import { LightningElement,api,track } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

const alphanumericAndSpaces18CharRegex = new RegExp("^[a-zA-Z0-9 ]{0,18}$");
const alphanumericAndSpaces20CharRegex = new RegExp("^[a-zA-Z0-9 ]{0,20}$");
const alphanumericAndSpaces25CharRegex = new RegExp("^[a-zA-Z0-9 ]{0,25}$");

export default class MailingAddComp extends LightningElement {

    isAddressLine1Required = false;
	isAddressLine2Required = false;
	isAddressLine1Disabled = true;
	isAddressLine2Disabled = true; 
	@api sectionHeader;
	@api addressLine1;
	@api addressLine2;
	@api city;
	@api state;
	@api zipCode;
	@api country;

	@api
	validate() {
		this.validateElement('addressLine1',this.addressLine1,'Address Line 1 must be 25 characters or less and cannot contain special characters.');
		if (this.addressLine2) {
			this.validateElement('addressLine2',this.addressLine2, 'Address Line 2 must be 20 characters or less and cannot contain special characters.');
		}
		if (this.city) {
			this.validateElement('city',this.city, 'City must be 18 characters or less and cannot contain special characters.');
		}
		const allValid = [
			...this.template.querySelectorAll('lightning-input'),
		].reduce((validSoFar, inputCmp) => {
			inputCmp.reportValidity();
			return validSoFar && inputCmp.checkValidity();
		}, true);
	if(allValid) {
		return { isValid: true };
	}
	else {
		return {
			isValid: false,
			errorMessage: ''
			};
		}
	}

	renderedCallback(){
		this.validateElement('addressLine1',this.addressLine1,'Address Line 1 must be 25 characters or less and cannot contain special characters.');
		if (this.addressLine2) {
			this.validateElement('addressLine2',this.addressLine2, 'Address Line 2 must be 20 characters or less and cannot contain special characters.');
		}
		if (this.city) {
			this.validateElement('city',this.city, 'City must be 18 characters or less and cannot contain special characters.');
		}
	}

	validateElement(fieldName,fieldValue,errorText){
		const input = this.template.querySelectorAll('lightning-input');
		const poBoxRegex = /^ *((#\d+)|((box|bin)[-. \/\\]?\d+)|(.*p[ \.]? ?(o|0)[-. \/\\]? *-?((box|bin)|b|(#|n|num|number)?\d+))|(p(ost|ostal)? *(o(ff(ice)?)?)? *((box|bin)|b)? *(#|n|num|number)*\d+)|(p *-?\/?(o)? *-?box)|postal box|POST BOX|post office|PB|P.BOX|P O S T O F F I C E B O X|POSTAL CODE|POST OFFICE ?(BIN)|((box|bin)|b) *(#|n|num|number)? *\d+|(#|n|num|number) *\d+)/i;
			input.forEach(element => {
				if (element.name === fieldName) {
					switch(fieldName){
						case 'addressLine1':
							if (alphanumericAndSpaces25CharRegex.test(fieldValue)) {
								if (poBoxRegex.test(fieldValue)) {
									this.setCustomFieldValidation(element, 'No PO Box Permitted');
									this.isAddressLine1Disabled = false;
								}
								else{
									this.setCustomFieldValidation(element, '');
								}
							}
							else{
								this.setCustomFieldValidation(element, errorText);
								this.isAddressLine1Disabled = false;
								this.isAddressLine2Disabled = false;
							}
							break;
						case 'addressLine2':
							if (alphanumericAndSpaces25CharRegex.test(fieldValue)) {
								if (poBoxRegex.test(fieldValue)) {
									this.setCustomFieldValidation(element, 'No PO Box Permitted');
									this.isAddressLine1Disabled = false;
								}
								else{
									this.setCustomFieldValidation(element, '');
								}
							}
							else{
								this.setCustomFieldValidation(element, errorText);
								this.isAddressLine2Disabled = false;
							}
						break;
						case 'city':
							if (alphanumericAndSpaces18CharRegex.test(fieldValue)) {
								this.setCustomFieldValidation(element, "");
							}
							else{
								this.setCustomFieldValidation(element, errorText);
								this.isCityDisabled = false;
							}
						break;
					}
					element.reportValidity();
				}
			});
	}

	setCustomFieldValidation(field, validationMessage){
		field.setCustomValidity(validationMessage);
		field.reportValidity();
	}

	 handleBlurAddressLine1(event) {
		this.addressLine1 = event.target.value;
		this.validateElement('addressLine1',this.addressLine1,'Address Line 1 must be 25 characters or less and cannot contain special characters.');
		this.UpdateFlow('addressLine1',this.addressLine1);
	}

	handleBlurAddressLine2(event) {
		this.addressLine2 = event.target.value;
		if (this.addressLine2) {
			this.validateElement('addressLine2',this.addressLine2, 'Address Line 2 must be 20 characters or less and cannot contain special characters.');
		}
		this.UpdateFlow('addressLine2',this.addressLine2);
	}

	handleBlurCity(event) {
		this.city = event.target.value;
		if (this.city) {
			this.validateElement('city',this.city, 'City must be 18 characters or less and cannot contain special characters.');
		}
		this.UpdateFlow('city',this.city);
	}

	UpdateFlow(propertyName,propertyValue) {
		const attributeChangeEvent = new FlowAttributeChangeEvent(propertyName, propertyValue);
		this.dispatchEvent(attributeChangeEvent);
	}
}