import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { COGNITO } from "../config";

const pool = () => new CognitoUserPool({ UserPoolId: COGNITO.userPoolId, ClientId: COGNITO.clientId });

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const user    = new CognitoUser({ Username: email, Pool: pool() });
    const details = new AuthenticationDetails({ Username: email, Password: password });
    user.authenticateUser(details, {
      onSuccess: session => resolve({
        idToken:      session.getIdToken().getJwtToken(),
        accessToken:  session.getAccessToken().getJwtToken(),
        refreshToken: session.getRefreshToken().getToken(),
        user:         session.getIdToken().decodePayload()
      }),
      onFailure: reject,
      newPasswordRequired: (attrs, required) => reject({ code: "NEW_PASSWORD_REQUIRED", attrs, required, user })
    });
  });
}

export function logout() {
  const user = pool().getCurrentUser();
  if (user) user.signOut();
  localStorage.removeItem("suivia_token");
  localStorage.removeItem("suivia_user");
}

export function currentSession() {
  return new Promise((resolve, reject) => {
    const user = pool().getCurrentUser();
    if (!user) return reject("No user");
    user.getSession((err, session) => {
      if (err || !session.isValid()) return reject(err || "Invalid session");
      resolve(session.getIdToken().getJwtToken());
    });
  });
}
