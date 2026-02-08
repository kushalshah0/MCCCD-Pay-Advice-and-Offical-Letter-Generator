const DOM = {
    paystub: document.getElementById('wrapper'),
    letter: document.getElementById('letter-wrapper'),

    name: document.getElementById('name'),
    title: document.getElementById('title'),
    dept: document.getElementById('dept'),
    empId: document.getElementById('empId'),
    email: document.getElementById('email'),
    gender: document.getElementById('gender'),

    salary: document.getElementById('salary'),
    fedRate: document.getElementById('fedRate'),
    stRate: document.getElementById('stRate')
};

const fmt = n =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const dateFmt = d =>
    d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

function getActivePage() {
    return DOM.paystub.style.display !== 'none'
        ? DOM.paystub
        : DOM.letter;
}

function toggleView(view) {
    DOM.paystub.style.display = view === 'paystub' ? 'block' : 'none';
    DOM.letter.style.display = view === 'letter' ? 'block' : 'none';
}

async function captureCanvas(el) {
    return await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });
}

async function downloadJPG() {
    const canvas = await captureCanvas(getActivePage());
    const link = document.createElement('a');
    link.download = 'MCCCD_Document.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

async function downloadPDF() {
    const canvas = await captureCanvas(getActivePage());
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
    });

    pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        0,
        8.5,
        11
    );

    pdf.save('MCCCD_Document.pdf');
}

function randomizeSalary() {
    const salary =
        Math.round(
            (Math.floor(Math.random() * (75000 - 45000 + 1)) + 45000) / 100
        ) * 100;

    DOM.salary.value = salary;
    DOM.fedRate.value = (Math.random() * (14 - 8) + 8).toFixed(1);

    generate();
}

function init() {
    DOM.empId.value = Math.floor(Math.random() * 899999) + 100000;
    randomizeSalary();
}

function generate() {
    const name = DOM.name.value.trim();
    const title = DOM.title.value;
    const dept = DOM.dept.value;
    const empId = DOM.empId.value;
    const email = DOM.email.value;
    const gender = DOM.gender.value;

    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);
    start.setDate(end.getDate() - 14);

    const startYear = new Date(now.getFullYear(), 0, 1);
    const periods = Math.max(
        1,
        Math.ceil((now - startYear) / (1000 * 60 * 60 * 24 * 14))
    );

    document.getElementById('dName').innerText = name.toUpperCase();
    document.getElementById('dId').innerText = empId;
    document.getElementById('dDept').innerText = dept;
    document.getElementById('dTitle').innerText = title;
    document.getElementById('pStart').innerText = dateFmt(start);
    document.getElementById('pEnd').innerText = dateFmt(end);
    document.getElementById('chkDate').innerText = dateFmt(now);

    const lastName = name.split(' ').pop() || name;
    const prefix =
        gender === 'Male' ? 'Mr.' : gender === 'Female' ? 'Ms.' : '';
    const pronoun =
        gender === 'Male' ? 'He' : gender === 'Female' ? 'She' : 'They';

    document.getElementById('lName').innerText = name;
    document.getElementById('lNameSubject').innerText = name;
    document.getElementById('lId').innerText = empId;
    document.getElementById('lEmail').innerText = email;
    document.getElementById('lLastName').innerText = `${prefix} ${lastName}`;
    document.getElementById('lPronoun').innerText = pronoun;
    document.getElementById('lTitle').innerText = title;
    document.getElementById('letterDate').innerText = dateFmt(now);

    const adv = document.getElementById('advNum');
    if (!adv.dataset.set) {
        adv.innerText = Math.floor(Math.random() * 89999999) + 10000000;
        adv.dataset.set = 'true';
    }

    const acct = document.getElementById('acct4');
    if (acct.innerText === '0000') {
        acct.innerText = Math.floor(Math.random() * 8999) + 1000;
    }

    document.getElementById('runDate').innerText =
        `Run Date: ${dateFmt(now)} ${now.toLocaleTimeString()}`;

    const annual = +DOM.salary.value || 0;
    const fedRate = (+DOM.fedRate.value || 0) / 100;
    const stRate = (+DOM.stRate.value || 0) / 100;

    const gross = annual / 26;
    const stipend = 250;
    const grossTotal = gross + stipend;

    const hourly = annual / 2080;

    document.getElementById('hrRate').innerText = fmt(hourly);
    document.getElementById('payCur').innerText = fmt(gross);
    document.getElementById('payYtd').innerText = fmt(gross * periods);
    document.getElementById('stipYtd').innerText = fmt(stipend * periods);
    document.getElementById('grossCur').innerText = fmt(grossTotal);
    document.getElementById('grossYtd').innerText = fmt(grossTotal * periods);

    const fed = grossTotal * fedRate;
    const st = grossTotal * stRate;
    const ss = grossTotal * 0.062;
    const med = grossTotal * 0.0145;
    const tax = fed + st + ss + med;

    document.getElementById('taxCur').innerText = fmt(tax);
    document.getElementById('taxYtd').innerText = fmt(tax * periods);

    const asrs = grossTotal * 0.1217;
    const ins = 85.5;
    const den = 12;
    const ded = asrs + ins + den;

    document.getElementById('dedCur').innerText = fmt(ded);
    document.getElementById('dedYtd').innerText = fmt(ded * periods);

    document.getElementById('netPay').innerText =
        '$' + fmt(grossTotal - tax - ded);
}

document.addEventListener('DOMContentLoaded', init);