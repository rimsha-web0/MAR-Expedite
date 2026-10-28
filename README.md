# MAR Expedite LLC — Website

Static website (HTML, CSS and JavaScript, with no build step) for **MAR Expedite LLC**, 131 Tazewell Rd, Newport News, VA 23608-3024.
Suggested domain: **marexpeditellc.com** · Contact email: **hometech12234@gmail.com**

## Pages
| File | Page |
|------|------|
| `index.html` | Home |
| `about.html` | About Us + company information |
| `services.html` | Services, approach, industries |
| `contact.html` | Contact / quote form with SMS opt-in checkboxes + map |
| `privacy-policy.html` | Privacy Policy (includes SMS / mobile data clause) |
| `terms-and-conditions.html` | Terms & Conditions (includes SMS program terms, `#sms-terms`) |

## Run locally
```bash
py -3 -m http.server 5510
```
Then open http://localhost:5510

## Before SMS (A2P 10DLC) verification
1. Connect the domain **marexpeditellc.com** to the deployed site (HTTPS).
2. Activate the contact form: submit it once on the live site. FormSubmit will email an activation link to hometech12234@gmail.com, and you need to click it.
3. Make sure the business name, address and email on the site match your Textla registration exactly.
4. A business phone number and a domain email (such as info@marexpeditellc.com) make verification stronger. Add them when you have them.

Photos come from [Unsplash](https://unsplash.com) and can be used for free under the Unsplash License.
