/**
 * An Exception Object
 */

export default class Exception extends Error {
  showError(errorMessage) {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.innerHTML = errorMessage;
    errorContainer.classList.remove('hide');
  }

  //  Sees what errormessage it has to show
  checkWichError() {
    switch (this.message) {
      case 'FirebaseError: Firebase: Error (auth/invalid-email).':
        this.showError('Ongeldige email');
        break;
      case 'FirebaseError: Firebase: Error (auth/user-not-found).':
        this.showError('Er is geen account met dat emailadres');
        break;
      case 'FirebaseError: Firebase: Error (auth/internal-error).':
        this.showError('Ongeldige email of wachtwoord');
        break;
      case 'FirebaseError: Firebase: Error (auth/wrong-password).':
        this.showError('Ongeldige email of wachtwoord');
        break;
      case 'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).':
        this.showError('Het wachtwoord moet minstens 6 tekens lang zijn');
        break;
      case 'FirebaseError: Firebase: Error (auth/email-already-in-use).':
        this.showError('Er bestaat al een account met dit emailadres');
        break;
      case 'Vul alle velden in':
        this.showError('Vul alle velden in');
        break;
      case 'Einddatum mag niet voor de startdatum liggen':
        this.showError('Einddatum mag niet voor de startdatum liggen');
        break;
      case 'Voor dezelfde datum mag eindtijd niet voor de starttijd liggen':
        this.showError('Voor dezelfde datum mag eindtijd niet voor de starttijd liggen');
        break;
      default:
        this.showError('Er is iets foutgelopen');
        break;
    }
  }
}
