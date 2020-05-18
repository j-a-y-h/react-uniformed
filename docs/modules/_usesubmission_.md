[react-uniformed](../README.md) › ["useSubmission"](_usesubmission_.md)

# Module: "useSubmission"

## Index

### Interfaces

* [SubmissionHandler](../interfaces/_usesubmission_.submissionhandler.md)
* [SubmitHandler](../interfaces/_usesubmission_.submithandler.md)
* [UseSubmissionHook](../interfaces/_usesubmission_.usesubmissionhook.md)
* [UseSubmissionProps](../interfaces/_usesubmission_.usesubmissionprops.md)

### Type aliases

* [SubmitFeedback](_usesubmission_.md#submitfeedback)

### Functions

* [useSubmission](_usesubmission_.md#usesubmission)

## Type aliases

###  SubmitFeedback

Ƭ **SubmitFeedback**: *Readonly‹object›*

## Functions

###  useSubmission

▸ **useSubmission**(`__namedParameters`: object): *[UseSubmissionHook](../interfaces/_usesubmission_.usesubmissionhook.md)*

Handles the form submission. Runs validation before calling the `onSubmit` function
if a `validator` is passed in.  If no validator was passed in, then the `onSubmit` function
will be invoked if disabled is set to false.  The validator function must set
the `disabled` prop to true, if there are errors in the form.
Disabled will prevent this hook from calling the `onSubmit` function.

Below is a flow diagram for this hook after `submit` is called:
```
               submit(Event)
                    |
  no - (validator is a function?) - yes
  |                                  |
  |                              validator()
  |__________________________________|
                   |
    no - (disabled is falsey?) - yes
                                  |
                             onSubmit(Event)
```

**`example`** <caption>This example is if you are not using the useForm hook.<br>_Note: the [useForm](_useform_.md#useform) hook handles all of this._</caption>
```javascript
 // create the submission handler
 const { isSubmitting, submit, submitCount } = useSubmission({
   disabled: hasErrors,
   onSubmit(values) { alert(values) },
 });

 return (
   <form onSubmit={submit}>
     You have attempted to submit this form {submitCount} times.
     {isSubmitting && "Please wait as we submit your form"}
     <button disabled={isSubmitting}>Submit</button>
   </form>
 )
```

**`example`** <caption>Setting feedback on submit</caption>
```javascript
const { submitFeedback } = useSubmission({
  onSubmit(values, {setFeedback}) {
     const data = await fetch('http://api.example.com', { body: values, method: 'POST' })
       .then(res => res.json());

     if (data) {
       // the submitFeedback.message value will be set for this case.
       setFeedback("Thank you for submitting!");
     } else {
       // if an error occurs then the submitFeedback.error value will be set
       throw "Something went wrong processing this form"
       // or when you return Promise.reject
       // return Promise.reject("Something went wrong processing this form");
     }
  }
});

// if an error occurred
submitFeedback.error === "Something went wrong processing this form"
// or if the submission was successful
submitFeedback.message === "Thank you for submitting!";
```

**`example`** <caption>Validation errors from the server</caption>
```javascript
const { submitFeedback } = useSubmission({
  onSubmit(values, {setError}) {
     const data = await fetch('http://api.example.com', { body: values, method: 'POST' })
       .then(res => res.json());

     if (data.errors) {
       data.errors.forEach(({error, fieldName}) => {
         // update the form with errors from the server.
         // note that this hook will not call reset if setError is called.
         setError(fieldName, error);
       });
     }
  }
});
```

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`disabled` | boolean | false | - |
`onSubmit` | [SubmissionHandler](../interfaces/_usesubmission_.submissionhandler.md) | - | the specified onSubmit handler. If your onSubmit handler is async, then you should return a promise in your function otherwise this won't work as expected. |
`reset` | undefined &#124; [reset](../interfaces/_usesubmission_.usesubmissionprops.md#optional-reset) | - | An optional method used to reset the state of the form after submission. |
`setError` | undefined &#124; [setError](../interfaces/_usesubmission_.usesubmissionprops.md#optional-seterror) | - | An optional function that is passed to the specified onSubmit handler.  When setError is called while submitting, the form will not call the specified reset function. |
`validator` | undefined &#124; [validator](../interfaces/_usesubmission_.usesubmissionprops.md#optional-validator) | - | the specified validator. If your validation logic is async, then you should return a promise in your function otherwise this won't work as expected. |
`values` | object | - | the specified values to use when submitting the form |

**Returns:** *[UseSubmissionHook](../interfaces/_usesubmission_.usesubmissionhook.md)*

returns a handler for onSubmit events,
 a count of how many times submit was called, and the state of the submission progress.
See {@link useFunctionStats}
