// Simple form handler for Plan a Visit
const form = document.querySelector('.visit-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Tak for din forespørgsel! Vi kontakter dig snarest.');
        form.reset();
    });
}
