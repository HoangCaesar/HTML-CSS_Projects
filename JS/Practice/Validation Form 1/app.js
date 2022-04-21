function Validator(options) {
    // 1) ELEMENTS + LOGIC
    // 1.1. Chuyển form selector ---> form element
    var formElement = document.querySelector(options.form);
    // Tạo chỗ chứa rules cho 1 input
    var selectorRules = {};

    if(formElement) {
        
        // Lấy rules chứa các object/rule
        // Chuyển input selector ---> input element && LỌC
        options.rules.forEach(function(rule) {

    // 1.2. Chuyển input selector ---> input element
            
            // NOTE: 1 INPUT vs [RULES]
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            // NOTE: nhiều INPUT/SELECTOR vs 1/n RULE
            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function(inputElement) {
                
                // 1.2.1. Lắng nghe sự kiện blur, rồi chạy validate
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }
                // 1.2.2. Bắt đầu điền thì tắt Alert
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.message);
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                    errorElement.innerText = '';
                }
                // 1.2.3. Xử lý SELECT/OPTION
                inputElement.onchange = function() {
                    validate(inputElement, rule);
                }
                
            });

        });
    // 1.3. Submit 
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true;

            // Check các inputs đã điền đúng/đủ hết chưa + lấy value of input
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);              
                if (!isValid) {
                    isFormValid = false;
                }
            });
            

            if(isFormValid) {
                // Submit with JS
                if(typeof options.onsubmit === 'function') {
                    // NOTE: INPUT SELECTOR ---> INPUT ELEMENT 2nd
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

                    options.onsubmit(
                        formValues
                    )
                // Submit with HTML SUBMIT DEFAULT
                } else {
                    formElement.submit();
                }

            }

        }

    }
    // Lấy thẻ parent chứa message để validate() hiển thị message
    function getParent(inputElement, parentSelector) {
        while(inputElement.parentElement) {
            if(inputElement.parentElement.matches(parentSelector)) {
                return inputElement.parentElement;
            }
            inputElement = inputElement.parentElement;
        }
    }

    // HÀM THỰC HIỆN VALIDATE
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.message);

            // NOTE: lấy [RULES] từ 1 INPUT
            var rules = selectorRules[rule.selector];

            for (var i = 0; i < rules.length; i++) {
                switch (inputElement.type) {
                    case 'checkbox':
                    case 'radio':
                        errorMessage = rules[i](
                            formElement.querySelector(rule.selector + ':checked')
                        );
                        break;
                    default:
                        errorMessage = rules[i](inputElement.value);
                }
                if(errorMessage) break;
            }

        if(errorMessage) {
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
            errorElement.innerText = errorMessage;
        } else {
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
            errorElement.innerText = '';
        }

        return !errorMessage;
    }
}

// 2) RULES
//  a) Nhận input selector
//  b) Return input selector lên tuyến trên, lên form element
//  c) Tạo + Return hàm test = rule, để tuyến trên xài

Validator.isRequired = function (selector, message) {

    return {
        selector: selector,
        test: function(value) {
            if(value === 'string') {
                return value.trim() ? undefined : message || 'Fill in this field, please!'
            } else {
                return value ? undefined : message || 'Fill in this field, please!'
            }
        }
    }

}

Validator.isEmail = function (selector, message) {

    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'This field needs an email!'
        }
    }

}

Validator.isPassword = function (selector, minLength, message) {

    return {
        selector: selector,
        test: function(value) {
            return value.length >= minLength ? undefined : message || 'Enter your password at least 6 characters, please'
        }
    }

}

Validator.isConfirmed = function (selector, getConfirmValue, message) {

    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Enter your password correctly'
        }
    }

}