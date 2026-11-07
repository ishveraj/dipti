import { dateFormat, decryptData, encryptData, g } from '@/utils/Functions';
import { DEV, For, Show, children, createContext, createSignal, onCleanup, onMount, splitProps, useContext } from "solid-js";
import { isServer } from 'solid-js/web';
import './Form.style.scss';
import Loader from './static/loader.json';

const FormContext = createContext();
const useForm = () => useContext(FormContext);

export const countryLists = [
  "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"
];

export const countryCodes = [
  "Algeria (+213)", "Andorra (+376)", "Angola (+244)", "Anguilla (+1264)", "Antigua and Barbuda (+1268)", "Argentina (+54)", "Armenia (+374)", "Aruba (+297)", "Australia (+61)", "Austria (+43)", "Azerbaijan (+994)", "Bahamas (+1242)", "Bahrain (+973)", "Bangladesh (+880)", "Barbados (+1246)", "Belarus (+375)", "Belgium (+32)", "Belize (+501)", "Benin (+229)", "Bermuda (+1441)", "Bhutan (+975)", "Bolivia (+591)", "Bosnia Herzegovina (+387)", "Botswana (+267)", "Brazil (+55)", "Brunei (+673)", "Bulgaria (+359)", "Burkina Faso (+226)", "Burundi (+257)", "Cambodia (+855)", "Cameroon (+237)", "Canada (+1)", "Cape Verde Islands (+238)", "Cayman Islands (+1345)", "Central African Republic (+236)", "Chile (+56)", "China (+86)", "Colombia (+57)", "Comoros (+269)", "Congo (+242)", "Cook Islands (+682)", "Costa Rica (+506)", "Croatia (+385)", "Cuba (+53)", "Cyprus North (+90392)", "Cyprus South (+357)", "Czech Republic (+42)", "Denmark (+45)", "Djibouti (+253)", "Dominica (+1809)", "Dominican Republic (+1809)", "Ecuador (+593)", "Egypt (+20)", "El Salvador (+503)", "Equatorial Guinea (+240)", "Eritrea (+291)", "Estonia (+372)", "Ethiopia (+251)", "Falkland Islands (+500)", "Faroe Islands (+298)", "Fiji (+679)", "Finland (+358)", "France (+33)", "French Guiana (+594)", "French Polynesia (+689)", "Gabon (+241)", "Gambia (+220)", "Georgia (+7880)", "Germany (+49)", "Ghana (+233)", "Gibraltar (+350)", "Greece (+30)", "Greenland (+299)", "Grenada (+1473)", "Guadeloupe (+590)", "Guam (+671)", "Guatemala (+502)", "Guinea (+224)", "Guinea - Bissau (+245)", "Guyana (+592)", "Haiti (+509)", "Honduras (+504)", "Hong Kong (+852)", "Hungary (+36)", "Iceland (+354)", "India (+91)", "Indonesia (+62)", "Iran (+98)", "Iraq (+964)", "Ireland (+353)", "Israel (+972)", "Italy (+39)", "Jamaica (+1876)", "Japan (+81)", "Jordan (+962)", "Kazakhstan (+7)", "Kenya (+254)", "Kiribati (+686)", "Korea North (+850)", "Korea South (+82)", "Kuwait (+965)", "Kyrgyzstan (+996)", "Laos (+856)", "Latvia (+371)", "Lebanon (+961)", "Lesotho (+266)", "Liberia (+231)", "Libya (+218)", "Liechtenstein (+417)", "Lithuania (+370)", "Luxembourg (+352)", "Macao (+853)", "Macedonia (+389)", "Madagascar (+261)", "Malawi (+265)", "Malaysia (+60)", "Maldives (+960)", "Mali (+223)", "Malta (+356)", "Marshall Islands (+692)", "Martinique (+596)", "Mauritania (+222)", "Mauritius (+230)", "Mayotte (+269)", "Mexico (+52)", "Micronesia (+691)", "Moldova (+373)", "Monaco (+377)", "Mongolia (+976)", "Montserrat (+1664)", "Morocco (+212)", "Mozambique (+258)", "Myanmar (+95)", "Namibia (+264)", "Nauru (+674)", "Nepal (+977)", "Netherlands (+31)", "New Caledonia (+687)", "New Zealand (+64)", "Nicaragua (+505)", "Niger (+227)", "Nigeria (+234)", "Niue (+683)", "Norfolk Islands (+672)", "Northern Marianas (+670)", "Norway (+47)", "Oman (+968)", "Pakistan (+92)", "Palau (+680)", "Panama (+507)", "Papua New Guinea (+675)", "Paraguay (+595)", "Peru (+51)", "Philippines (+63)", "Poland (+48)", "Portugal (+351)", "Puerto Rico (+1787)", "Qatar (+974)", "Reunion (+262)", "Romania (+40)", "Russia (+7)", "Rwanda (+250)", "San Marino (+378)", "Sao Tome and Principe (+239)", "Saudi Arabia (+966)", "Senegal (+221)", "Serbia (+381)", "Seychelles (+248)", "Sierra Leone (+232)", "Singapore (+65)", "Slovak Republic (+421)", "Slovenia (+386)", "Solomon Islands (+677)", "Somalia (+252)", "South Africa (+27)", "Spain (+34)", "Sri Lanka (+94)", "St. Helena (+290)", "St. Kitts (+1869)", "St. Lucia (+1758)", "Sudan (+249)", "Suriname (+597)", "Swaziland (+268)", "Sweden (+46)", "Switzerland (+41)", "Syria (+963)", "Taiwan (+886)", "Tajikstan (+7)", "Thailand (+66)", "Togo (+228)", "Tonga (+676)", "Trinidad and Tobago (+1868)", "Tunisia (+216)", "Turkey (+90)", "Turkmenistan (+7)", "Turkmenistan (+993)", "Turks and Caicos Islands (+1649)", "Tuvalu (+688)", "Uganda (+256)", "UK (+44)", "Ukraine (+380)", "United Arab Emirates (+971)", "Uruguay (+598)", "USA (+1)", "Uzbekistan (+7)", "Vanuatu (+678)", "Vatican City (+379)", "Venezuela (+58)", "Vietnam (+84)", "Virgin Islands - British (+1284)", "Virgin Islands - US (+1340)", "Wallis and Futuna (+681)", "Yemen (North)(+969)", "Yemen (South)(+967)", "Zambia (+260)", "Zimbabwe (+263)"
]

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const getDateSup = (n) => {
  if (n === 1 || n === 21 || n === 31) return "st";
  if (n === 2 || n === 22) return "nd";
  if (n === 3 || n === 23) return "rd";
  return "th";
};

// Parse "YYYY-MM-DD" as a local date (new Date(str) parses as UTC)
const parseYmd = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatNice = (d) => {
  return `${d.getDate()}${getDateSup(d.getDate())} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

const shiftDays = (s, days) => {
  const d = parseYmd(s);
  d.setDate(d.getDate() + days);
  return d;
};


export function Form(props){
  const formID = props.id;
  let uniqid = 1;
  let formRef, resultTimeout;

  const useDomain = props.domain ?? g.domain;
  let requestURL = 'false';
  if (props.action) {
    requestURL = props.action.startsWith('https://')
      ? props.action
      : `${useDomain}hub/api/post/${props.action}`;
  }

  onMount(() => $(formRef).parsley());

  const setBtnLoading = (btn, on) => {
    btn.disabled = on;
    btn.classList.toggle('skeleton-loader', on);

    if (on) {
      const p = document.createElement('lottie-player');
      p.className = 'lottie position-absolute';
      p.src = Loader;
      p.setAttribute('background', 'transparent');
      p.setAttribute('speed', '1');
      p.setAttribute('loop', '');
      p.setAttribute('autoplay', '');
      p.style.height = '30px';
      btn.appendChild(p);
    } else {
      btn.querySelector('.lottie')?.remove();
    }
  };

  const submitForm = async (btn) => {
    if (isServer) return;
    const $form = $(formRef);
    const redirect = props.redirect || 'false';
    const reset = props.reset || 'true';

    setBtnLoading(btn, true);
    $form.parsley().validate();

    if (!$form.parsley().isValid()) {
      setBtnLoading(btn, false);
      return;
    }

    $form.trigger('form.submit');
    $form.find('.loader').fadeIn();

    try {
      const formData = new FormData(formRef);

      // Captcha
      if (window.grecaptcha?.enterprise) {
        await new Promise((r) => grecaptcha.enterprise.ready(r));
        const token = await grecaptcha.enterprise.execute(
          '6LesPMEtAAAAAJZCJR_kJ3SNzhLzEtEtFpNTTxoa',
          { action: 'LOGIN' }
        );
        if (token) formData.append('recaptcha_token', token);
      }

      const args = { FormID: formID, FormRequest: requestURL };

      // No request, just finish up
      if (requestURL === 'false') {
        $form.trigger('form.done', [args]);
        if (reset === 'true') formRef.reset();
        if (redirect !== 'false') window.location.href = redirect;
        return;
      }

      const headers = {};
      const atk = localStorage.getItem('aTK');
      if (DEV) headers.Authorization = 'Basic ' + g.devToken;
      if (atk) headers.Authorization = 'Bearer ' + atk;

      const res = await fetch(requestURL, { method: 'POST', body: formData, headers });
      const data = await res.json();

      $form.trigger('form.done', [args, data]);

      if (redirect !== 'false' && data.status === 'redirect') {
        window.location.href = redirect;
        return;
      }

      const result = $form.find('.result');
      result.find('p').html(data.status);
      result.fadeIn();
      clearTimeout(resultTimeout);
      resultTimeout = setTimeout(() => result.fadeOut(), 5000);

      if (reset === 'true') formRef.reset();
    } 
    catch (err) {
      console.error(err);
    } 
    finally {
      $form.find('.loader').fadeOut();
      setBtnLoading(btn, false);
    }
  };

  return (
    <FormContext.Provider value={{ formID, getUniqid: () => uniqid++ }}>
      <form
        ref={formRef}
        autocomplete="off"
        id={formID}
        class={props.class}
        enctype="multipart/form-data"
        onClick={(e) => {
          const btn = e.target.closest('.formsubmitbtn');
          if (btn && !btn.disabled) submitForm(btn);
        }}
        onReset={(e) => {
          const form = e.currentTarget;

          // Wait for the native reset to finish first
          setTimeout(() => {
            form.querySelectorAll('.neo-custom-select').forEach((select) => {
              const toggle = select.querySelector('.dropdown-toggle');
              const input = select.querySelector('input');
              const defaultValue = toggle?.dataset.original;
              if (!defaultValue || !input) return;

              const items = select.querySelectorAll('.dropdown-item');
              items.forEach((each) => each.classList.remove('selected', 'found'));

              const choice = items[Number(defaultValue)];
              if (!choice) return;

              input.value = '';
              toggle.textContent = choice.textContent;
              if (!choice.classList.contains('disabled')) {
                input.value = choice.dataset.val ?? choice.textContent;
              }
            });

            // Reset files
            form.querySelectorAll('.fileinputbox .file-inform, .fileinputbox .file-danger')
              .forEach((el) => el.remove());
            form.querySelectorAll('.fileinputbox img')
              .forEach((img) => img.setAttribute('src', ''));
          }, 0);
        }}
      >
        <lottie-player class="lottie loader" src={Loader} background="transparent" speed="1" style="height: 70px;" loop autoplay></lottie-player>
        {props.children}
      </form>
    </FormContext.Provider>
  );
}

export function Input(props){
  const { formID, getUniqid } = useForm();

  // Add form-control to class
  let propsClass = props?.class ?? '';
  props.class = `form-control ${props.class ?? ''}`;

  // For special input types
  let returnRender;
  switch (props.type) {
    case 'text':
    case 'email': 
    case 'number': {
      returnRender = (<input {...props}/>);
      break;
    }

    case 'tel': {
      returnRender = (
        <input 
          {...props} 
          
          onBeforeInput={(e) => {
            if (e.data && !/^[0-9]+$/.test(e.data)) e.preventDefault();
          }}
        />
      );

      break;
    }

    case 'hidden': {
      returnRender = (<input type="hidden" name={props.name} value={props.value ?? ''}/>);
      break;
    }

    case 'password': {
      let thisRef;

      returnRender = (
      <div class="form-box">
        <input {...props} ref={thisRef}/>
        <i class="password-action showpassword" onClick={(e) => {
          if (e.currentTarget.classList.contains('showpassword')){
            e.currentTarget.classList.replace('showpassword', 'hidepassword');
            thisRef.type = 'text';
          }
          else {
            e.currentTarget.classList.replace('hidepassword', 'showpassword');
            thisRef.type = 'password';
          }
        }}/>
      </div>
      );

      break;
    }

    case 'date': {
      const [local, rest] = splitProps(props, ['value']);
      let textRef;

      const yyyymmdd = local.value ? dateFormat(local.value, 'Y-m-d') : null;
      const niceDate = local.value ? dateFormat(local.value, 'jS F Y') : null;

      const onDateInput = (e) => {
        const input = e.currentTarget;
        const v = input.value.trim();

        if (!v) {
          textRef.value = '';
          return;
        }

        const { min, max } = input;
        let error = '';

        if (min && max) {
          if (v < min || v > max) {
            error = `Dates available are between ${formatNice(parseYmd(min))} and ${formatNice(parseYmd(max))}`;
          }
        } else if (min && v < min) {
          error = `Dates available are only after ${formatNice(shiftDays(min, -1))}`;
        } else if (max && v > max) {
          error = `Dates available are only before ${formatNice(shiftDays(max, 1))}`;
        }

        if (error) {
          textRef.value = '';
          alert(error);
          input.blur();
          return;
        }

        textRef.value = formatNice(parseYmd(v));
        input.closest('.neo-custom-date').querySelector('.parsley-errors-list')?.remove();
        textRef.classList.remove('parsley-error');
      };

      returnRender = (
        <div class="form-box">
          <div class="neo-custom-date">
            <input {...rest} value={yyyymmdd} onInput={onDateInput} />
            <input
              ref={textRef}
              class={props.class}
              type="text"
              placeholder={props.placeholder}
              value={niceDate}
              required={props.required}
              onInput={(e) => {
                const cleaned = e.currentTarget.value.replace(/(\d+)(st|nd|rd|th)/, '$1');
                if (isNaN(new Date(cleaned).getTime())) e.currentTarget.value = '';
              }}
            />
            <i class="dateicon"></i>
          </div>
        </div>
      );

      break;
    }

    case 'textarea': {
      delete props.type;
      returnRender = (<textarea {...props}/>);
      break;
    }

    case 'select': {
      let thisRef, thisBtnRef, thisDropdownMenu;
      delete props.type;
      
      // Set the selected option for fake select
      let setSelected;
      let originalIndex = 0;
      const c = children(() => props.children);
      c().some((element, index) => {
        if ( element ){
          if ( index === 0 ) setSelected = element;
          if ( element.selected ){
            setSelected = element;
            originalIndex = index;
            return true;
          }
        }
      });

      returnRender = (
      <div class={`dropdown neo-custom-select ${props.class ?? ''}`} id={props.id ?? null}>
        <button ref={thisBtnRef} class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-original={originalIndex}>
          {setSelected.text}
        </button>
        
        <div ref={thisDropdownMenu} class="dropdown-menu" data-lenis-prevent>
          <For each={c()}>{(option) =>
            <Show when={option}>
              <p 
              class={`dropdown-item ${setSelected.text === option.text ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`} 
              data-val={option.value ?? option.text}
              onClick={(e) => {
                thisDropdownMenu.querySelectorAll('.dropdown-item').forEach(each => {
                  each.classList.remove('selected', 'found');
                });

                e.currentTarget.classList.add('selected');
                thisRef.value = option.value ?? option.text;
                thisBtnRef.textContent = option.text;
              }}
              >
                {option.text}
              </p>
            </Show>
          }</For>
        </div>

        <input ref={thisRef} type="text" class="neo-select-input" name={props.name} value={( setSelected.value && !setSelected.disabled ) ? ( setSelected.value ?? setSelected.text ) : null} required={props.required ?? null}/>
      </div>
      );
      
      break;
    }

    case 'radio':
    case 'checkbox': {
      const chID = `${formID}chrd${getUniqid()}`;
      const useVertical = props?.vertical ? true : false;
      const checkoptions = children(() => props.children);

      returnRender = (
      <div class={`form-input-choice-wrapper ${useVertical ? '' : 'flex-column'} ${propsClass}`}>
      <For each={checkoptions()}>{(option, id) => 
        <div class={`checkrads ${option.classList}`}>
          <input  type={props.type} name={props.name} id={chID + id()} value={option?.value ?? option.text} checked={option?.selected ?? null} required={props?.required ?? null}/>
          <label for={chID + id()} innerHTML={option?.text ?? option.value}/>
        </div>
      }</For>
      </div>
      );

      break;
    }

    case 'file': {
      const [local, rest] = splitProps(props, ['class', 'id', 'limit', 'maxFiles', 'hasImagePreview']);
      const flID = local.id ?? formID + 'flup' + getUniqid();
      const limit = local.limit ? local.limit.toUpperCase() : '1MB';

      const [info, setInfo] = createSignal('');
      const [error, setError] = createSignal('');
      const [preview, setPreview] = createSignal('');
      let inputRef;

      const validationKey = (local.maxFiles || props.accept)
        ? encryptData(JSON.stringify({ max: local.maxFiles ?? 1, types: props.accept ?? '' }))
        : false;

      const clearAll = () => {
        if (preview()) URL.revokeObjectURL(preview());
        setPreview('');
        setInfo('');
        setError('');
      };

      const onFileInput = (e) => {
        const input = e.currentTarget;
        const files = input.files;
        const plural = files.length > 1 ? 'files' : 'file';

        clearAll();
        if (!files.length) return;

        if (validationKey) {
          let criteria;
          try { criteria = JSON.parse(decryptData(validationKey)); }
          catch { input.value = ''; return; }

          if (files.length > criteria.max) {
            input.value = '';
            setError(`Maximum of ${criteria.max} ${plural} allowed`);
            return;
          }

          const types = criteria.types
            ? criteria.types.split(',').map((t) => t.toLowerCase().replace('.', '').trim())
            : [];

          const typesOk = !types.length ||
            [...files].every((f) => types.some((t) => f.type.toLowerCase().includes(t)));

          if (!typesOk) {
            input.value = '';
            setError(`Allowed file types (${types.join(', ')})`);
            return;
          }
        }

        if (local.hasImagePreview && files[0].type.toLowerCase().includes('image')) {
          setPreview(URL.createObjectURL(files[0]));
        }

        setInfo(`${files.length} ${plural} selected`);
      };

      onMount(() => inputRef.form?.addEventListener('reset', clearAll));
      onCleanup(() => {
        inputRef.form?.removeEventListener('reset', clearAll);
        if (preview()) URL.revokeObjectURL(preview());
      });

      returnRender = (
        <div class={`fileinputbox ${local.class ?? ''}`}>
          <label for={flID}>
            <Show when={local.hasImagePreview}>
              <img src={preview() || undefined} />
            </Show>

            <i class="icon-upload" />
            {props.placeholder}
            <span>
              Drag & drop files here
              <br />
              Supports {props.accept ? props.accept.toUpperCase() : 'all files'}
              <br />
              File size limited to {limit} per file
            </span>
          </label>

          <input {...rest} id={flID} ref={inputRef} onInput={onFileInput} />

          <Show when={error()}>
            <div class="text-center mt-1 file-danger"><p class="alert-danger">{error()}</p></div>
          </Show>
          <Show when={info()}>
            <div class="text-center file-inform"><p class="file-no">{info()}</p></div>
          </Show>
        </div>
      );
      break;
    }

    case 'quantity': {
      let thisRef;
      const min = parseInt(props.min ?? 1, 10);
      const max = Math.max(min, parseInt(props.max ?? min + 9, 10));

      const inputProps = { ...props, type: 'tel', value: props.value ?? min };
      delete inputProps.class;

      const clamp = (n) => Math.min(max, Math.max(min, n));
      const current = () => parseInt(thisRef.value, 10) || min;

      returnRender = (
        <div class={`form-box quantity-input ${propsClass}`}>
          <i class="fa fa-minus minus-action"
            onClick={() => (thisRef.value = clamp(current() - 1))} 
          />

          <input
            class="form-control"
            {...inputProps}
            ref={thisRef}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
            }}
            onBlur={() => (thisRef.value = clamp(current()))}
          />

          <i class="fa fa-plus plus-action"
            onClick={() => (thisRef.value = clamp(current() + 1))} 
          />
        </div>
      );
      break;
    }
  }

  return returnRender;
}

export function Submit(props){
  return <>
    <button type="button" class={`formsubmitbtn ${props.class}`} id={props.id}>{props.children}</button>
  </>;
}

export function Response(){
  return <div class="result"><p></p></div>;
}