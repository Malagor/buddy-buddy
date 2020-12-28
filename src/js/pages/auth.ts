export const authHTML = () => `
<form id="auth-form" method="get" class="auth-form">
<input id="email" type="email" name="email" placeholder="E-mail">
<input id="password" type="password" name="password" placeholder="Your password">
<button class="btn" id="login">Login</button>
<button class="btn" id="signIn" type="submit" form="auth-form">Sign In</button>
</form>
`;
