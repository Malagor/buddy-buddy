export const authHTML = () => '<form class="list" id="auth-form" method="get">\n' +
  '        <ul>\n' +
  '          <li>\n' +
  '            <div class="item-content item-input">\n' +
  '              <div class="item-inner">\n' +
  '                <div class="item-title item-label">E-mail</div>\n' +
  '                <div class="item-input-wrap">\n' +
  '                  <input id="email" type="email" name="email" placeholder="E-mail">\n' +
  '                </div>\n' +
  '              </div>\n' +
  '            </div>\n' +
  '          </li>\n' +
  '          <li>\n' +
  '            <div class="item-content item-input">\n' +
  '              <div class="item-inner">\n' +
  '                <div class="item-title item-label">Password</div>\n' +
  '                <div class="item-input-wrap">\n' +
  '                  <input id="password" type="password" name="password" placeholder="Your password">\n' +
  '                </div>\n' +
  '              </div>\n' +
  '            </div>\n' +
  '          </li>\n' +
  '        </ul>\n' +
  '      </form>' +
  '<div class="block block-strong row">\n' +
  '  <div class="col"><button class="button" id="login">Login</button></div>\n' +
  '  <div class="col"><button class="button" id="signIn" type="submit" form="auth-form">Sign In</button></div>\n' +
  '</div>';
