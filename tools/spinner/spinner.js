document.addEventListener('DOMContentLoaded', init);

function decode(str) {
  if (!str)
    return [];
  if (str.startsWith('items=')) {
    return decodeURIComponent(str.substring(6)).split(',');
  }
  return [];
}

const items = decode(location.search.substring(1));
function init() {
  let edit = document.querySelector('#edit');
  edit.addEventListener('click', showEditDialog);
  let gradient = [];
  let wheel = document.querySelector('.wheel');
  wheel.addEventListener('click', spin);
  if (items.length == 0) {
    for (let i = 0; i < 360; i+= 30)
        gradient.push(`hsl(${i}, 50%, 50%) ${i}deg`);
  } else {
    let arc = 360 / items.length;
    let currentArc = 0;
    for (let i = 0; i < items.length; i++) {
      let item = document.createElement('div');
      item.textContent = items[i];
      let midArc = Math.round(currentArc + arc / 2);
      if (midArc < 180) {
        item.className = 'item';
        item.style.transform = `translateY(-50%) rotateZ(${-90 + midArc}deg)`;
      } else {
        item.className = 'item left';
        item.style.transform = `translateY(-50%) rotateZ(${-90 + (midArc - 180)}deg)`;
      }
      wheel.appendChild(item);
      gradient.push(`hsl(${currentArc}, 50%, 50%) ${currentArc}deg ${currentArc + arc}deg`);
      currentArc += arc;
    }
  }
  wheel.style.background = `conic-gradient(${gradient.join(', ')})`;

  let entries = document.querySelector('#edit-dialog .entries');
  for (let i = 0; i < items.length; i++) {
    let input = document.createElement('input');
    input.value = items[i];
    entries.appendChild(input);
  }
  updateEntries();
  entries.addEventListener('change', updateEntries);
  document.querySelector('#save').addEventListener('click', () => {
    let query = '?items=';
    let values = [];
    for (let i = 0; i < entries.children.length - 1; ++i) {
      values.push(entries.children[i].value);
    }
    query += values.join(',');
    window.location = query;
  });
}

function updateEntries() {
  let entries = document.querySelector('#edit-dialog .entries');
  let children = entries.children;
  for (let i = 0; i < children.length - 1; i++) {
    if (children[i].value == '')
      entries.removeChild(children[i--]);
  }
  if (children.length == 0 || children[children.length - 1].value != '')
    entries.appendChild(document.createElement('input'));
}

function spin(evt) {
  evt.preventDefault();
  let spinner = document.querySelector('.spinner');
  spinner.rotation = spinner.rotation || 0;
  let amt = (Math.random() * 2 + 3) * 360;
  spinner.rotation += amt;
  spinner.style.transform = `translateX(-50%) rotateZ(${spinner.rotation}deg) translate(0, 7.14%)`;
}

function showEditDialog(evt) {
  evt.preventDefault();
  let dialog = document.querySelector('#edit-dialog');
  dialog.classList.add('visible');
}
