import mockLanguages from '../mocks/languages.js'
const LANGUAGE_KEY = 'languages'

function getLanguageList() {
    return JSON.parse(localStorage.getItem(LANGUAGE_KEY))
}

function saveLanguageList(list) {
    localStorage.setItem(LANGUAGE_KEY, JSON.stringify(list))
}
function initLanguageDB() {
    const existing = getLanguageList()
    if (!existing || existing.length === 0) {
        saveLanguageList(mockLanguages)
    }
}
initLanguageDB()

export function getAllLanguages() {
    return getLanguageList()
}
