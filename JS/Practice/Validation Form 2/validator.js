
function Validator(formSelector) {
    var _this = this;

    // NOTE: input - [rules]
    var formRules = {};

    // NOTE: validate rules
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Fill in this required field, please'
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Tour E-mail is wrong!'
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Enter at least ${min} characters`
            }
        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Enter at least ${max} characters`
            }
        },
    };
    
    // 1) Selector ---> Element
    var formElement = document.querySelector(formSelector);

    if(formElement) {

        var inputs = formElement.querySelectorAll('[name][rules]')
        
        // 2) Lấy rules cho input
        for(var input of inputs) {

            var rules = input.getAttribute('rules').split('|');

            for(var rule of rules) {

                var ruleInfo;
                var ruleCheck = rule.includes(':')

                if(ruleCheck) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if(ruleCheck) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }

            }

        // Validate
        input.onblur = validate;
        // Clear
        input.oninput = clearErrors;

        }

        // Lấy thẻ parent ĐỂ chọc vào thẻ message
        function getParent(element, selector) {
            while(element.parentElement) {
                if(element.parentElement.matches(selector)) {
                    return element.parentElement;
                }
                element = element.parentElement;
            }
        }

        // NOTE: validate 
        function validate(event) {

            var rules = formRules[event.target.name];
            var formGroup = getParent(event.target, '.form-group');
            var formMessage = formGroup.querySelector('.form-message');
            var errorMessage;

            rules.some(function(rule) {
                errorMessage = rule(event.target.value);
                return errorMessage;
            });

            // Hiển thị ra UI
            if(errorMessage) {
                formGroup.classList.add('invalid');
                formMessage.innerText = errorMessage;
            } else {
                formGroup.classList.remove('invalid');
                formMessage.innerText = '';
            }
        
        return !errorMessage;

        }

        // NOTE: clear errors
        function clearErrors(event) {
            var formGroup = getParent(event.target, '.form-group');
            var formMessage = formGroup.querySelector('.form-message');
            formGroup.classList.remove('invalid');
            formMessage.innerText = '';
        }

        // NOTE: xử lý submit form
        formElement.onsubmit = function(event) {

            event.preventDefault();
            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValidForm = true;
        
            for(var input of inputs) {

                var isValid = validate( {target: input} );
                if(!isValid) {
                    var isValidForm = false;
                }
            }

            if(isValidForm) {
                if(typeof _this.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                   
                    var formValues = Array.from(enableInputs).reduce(function(values, enableInput) {
                        
                        switch (enableInput.type){

                            case 'checkbox':
                                if(!enableInput.matches(':checked')) {
                                    if(!Array.isArray(values[enableInput.name])) {
                                        values[enableInput.name]  = '';
                                    }
                                    return values;
                                }

                                if(!Array.isArray(values[enableInput.name])) {
                                    values[enableInput.name] = [];
                                }
                                
                                values[enableInput.name].push(enableInput.value);
                                break;

                            case 'radio':
                                values[enableInput.name] = formElement.querySelector('input[name="' + enableInput.name + '"]:checked').value;
                                break;
                            
                            case 'file':
                                values[enableInput.name] = enableInput.files;
                                break;
                            default:
                                values[enableInput.name] = enableInput.value;
                        }
                        return values;

                    }, {});

                    // Submit = Ajax
                    _this.onSubmit(formValues);

                // Submit = HTML default
                } else {
                    formElement.submit();                
                }
            }

        }

    }

}