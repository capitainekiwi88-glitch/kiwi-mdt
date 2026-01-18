# Gestion du Backspace - Solution équilibrée

## 🎯 Problème résolu

**Problème**: La touche `backspace` fermait accidentellement la tablette MDT lors de la saisie de texte.

**Solution**: Gestion intelligente selon le contexte et les modificateurs.

## ✅ Logique implémentée

```javascript
if (e.key === "Backspace" && visible) {
  // Ctrl + Backspace = suppression intentionnelle partout
  if (e.ctrlKey) {
    return; // Autoriser
  }

  // Dans les champs éditables = suppression normale
  if (isEditable) {
    return; // Autoriser
  }

  // Partout ailleurs = bloquer
  e.preventDefault(); // Bloquer
}
```

## 🎮 Comportements

### ✅ **Autorisé**
- **Dans les champs INPUT/TEXTAREA** : `backspace` fonctionne normalement
- **Avec Ctrl enfoncé** : `Ctrl + Backspace` fonctionne partout (suppression intentionnelle)

### ❌ **Bloqué**
- **En dehors des champs** : `backspace` seul est bloqué pour éviter les accidents

## 🛡️ Protection

- **Phase de capture** : Interception précoce de l'événement
- **stopImmediatePropagation** : Arrêt complet de la propagation
- **Logs de debug** : Suivi des actions en console

## 🎯 Contrôles utilisateur

- **F10** : Ouvrir la tablette
- **Échap** : Fermer la tablette
- **Backspace** :
  - Dans un champ : ✅ suppression normale
  - Avec Ctrl : ✅ suppression partout
  - Ailleurs : ❌ bloqué (évite fermeture accidentelle)

## 🧪 Test

1. Ouvrir la tablette (F10)
2. Taper dans un champ de recherche : `backspace` fonctionne ✅
3. Taper dans la description : `backspace` fonctionne ✅
4. Cliquer ailleurs et taper `backspace` : rien ne se passe ✅
5. `Ctrl + Backspace` n'importe où : fonctionne ✅

---

**Status**: ✅ Backspace intelligent, suppression préservée