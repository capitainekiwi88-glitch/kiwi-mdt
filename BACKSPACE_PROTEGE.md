# Gestion des touches clavier - Backspace protégé

## 🛡️ Problème résolu

**Problème**: La touche `backspace` fermait accidentellement la tablette MDT en jeu.

**Cause**: Comportement par défaut de la touche backspace dans les navigateurs/interfaces web.

## ✅ Solution implémentée

### Gestion intelligente des touches

```javascript
const handleKeyDown = (e: KeyboardEvent) => {
  // Échap ferme toujours la tablette
  if (e.key === "Escape" && visible) {
    closeMDT();
    e.preventDefault();
    return;
  }

  // Backspace : comportement intelligent
  if (e.key === "Backspace" && visible) {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' ||
                   target.tagName === 'TEXTAREA' ||
                   target.contentEditable === 'true';

    // Si on n'est pas dans un champ de saisie, empêcher le backspace
    if (!isInput) {
      e.preventDefault();
      console.log('Backspace empêché en dehors d\'un champ de saisie');
    }
    // Si on est dans un champ de saisie, comportement normal autorisé
  }
};
```

### Logique de protection

1. **Dans les champs de saisie** (`input`, `textarea`, éléments `contentEditable`) :
   - ✅ Backspace fonctionne normalement (suppression de texte)

2. **En dehors des champs de saisie** :
   - ❌ Backspace est empêché (évite la fermeture accidentelle)

3. **Touche Échap** :
   - ✅ Ferme toujours la tablette (comportement inchangé)

## 🎮 Contrôles en jeu

- **F10** : Ouvrir la tablette MDT
- **Échap** : Fermer la tablette MDT
- **Backspace** : Maintenant protégé contre les accidents !

## 🧪 Test

- Ouvrez la tablette (F10)
- Essayez de taper backspace en dehors d'un champ : rien ne se passe
- Tapez dans un champ de saisie : backspace fonctionne normalement
- Appuyez sur Échap : ferme la tablette

---

**Status**: ✅ Backspace protégé, Échap préservé