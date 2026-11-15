// Static mail composer: the visitor reviews and sends in their own mail app.
export function initHomeContact() {
  const form=document.querySelector('.home-contact-content');
  const email=document.querySelector('#contact-email');
  const copy=document.querySelector('.home-copy-email');
  const status=document.querySelector('#contact-status');
  const fields=[form.elements.subject,form.elements.body];
  form.noValidate=true;
  const errors=fields.map(field=>{
    const error=document.createElement('span');error.className='home-contact-field-error';
    error.id=field.id+'-error';error.hidden=true;field.after(error);
    field.setAttribute('aria-describedby',error.id);
    field.addEventListener('input',()=>{
      if(field.value.trim()){field.removeAttribute('aria-invalid');error.hidden=true;error.textContent='';}
    });
    return error;
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();status.textContent='';let firstInvalid;
    fields.forEach((field,i)=>{
      const valid=Boolean(field.value.trim());
      if(valid){field.removeAttribute('aria-invalid');errors[i].hidden=true;errors[i].textContent='';return;}
      field.setAttribute('aria-invalid','true');errors[i].hidden=false;
      errors[i].textContent=i===0?'Enter a subject.':'Enter your message.';
      firstInvalid??=field;
    });
    if(firstInvalid){firstInvalid.focus();return;}
    const link=document.createElement('a');
    link.href=form.action+'?subject='+encodeURIComponent(fields[0].value.trim())+'&body='+encodeURIComponent(fields[1].value.trim());
    link.hidden=true;document.body.append(link);
    status.textContent='Opening your email app. Review your message before sending.';
    link.click();link.remove();
  });
  copy.hidden=false;
  copy.addEventListener('click',async()=>{
    copy.disabled=true;status.textContent='';
    try{
      await navigator.clipboard.writeText(email.textContent);
      status.textContent='Email copied.';
    }catch{
      email.focus({preventScroll:true});
      const selection=getSelection(),range=document.createRange();range.selectNodeContents(email);
      selection.removeAllRanges();selection.addRange(range);
      status.textContent='Email selected. Press Ctrl+C or Command+C to copy.';
    }finally{copy.disabled=false;}
  });
}
