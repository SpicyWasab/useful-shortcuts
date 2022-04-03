// handle textareas formatting
const commands = {
    KeyI: 'italic',
    KeyB: 'bold',
    KeyU: 'underline'
}

export function startEditors() {
    const editors = [...document.querySelectorAll('.editor')];

    editors.forEach(editor => {
        editor.addEventListener('keydown', (e) => {
            const { ctrlKey, code } = e;

            if(!ctrlKey) return;
        
            const command = commands[code];

            if(!command) return;

            e.preventDefault();
            document.execCommand(command, false, '');
        });
    })
}