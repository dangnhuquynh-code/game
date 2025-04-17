function requestPopup(type) {
    parent.postMessage({
        action: 'openPopup',
        type: type,
        popupCSS: 'popup-muahe.css'
    }, '*');
}