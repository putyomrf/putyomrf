var Global = {};

(function () {
  document.addEventListener('DOMContentLoaded', main);


  function main() {

    var //==============CONSTANTS===============
      BTN_SHORT_ANIM_TIME = 700,
      //==============VARIABLES===============
      shorterForm = document.querySelector('.shorter-inp-form'),
      shortInpWrpr = shorterForm.querySelector('.shorter-inp-wrpr'),
      shortInpLink = shorterForm.querySelector('.inp-short-link'),
      shortInpName = shorterForm.querySelector('.inp-short-name'),
      shortInpBtn = shorterForm.querySelector('.shorter-submit-btn'),
      shortLink,
      errTooltipControl,
      submitStatus = false,
      cursorTarget,
      //==========CLASSES, OBJECTS=============
      //TODO ADD CONSTRUCTOR
      submitLink = {
        submit: function () {
          var link = encodeURIComponent(shortInpLink.value),
            linkName = shortInpName.value, //encodeURIComponent(shortInpName.value),
            shorterAddress = '/shorten',
            self = this,
            resBody;

          if (submitStatus) {
            return;
          }

          //TODO ADD INPUT DISABLING, WHEN SHORTED LINK IS REQUESTED
          errTooltipControl.showSpinner();

          submitStatus = true;

          if (isNamedLink) {
            resBody = 'url=' + link + '&name=' + linkName;
          } else {
            resBody = 'url=' + link;
          }

          console.log(resBody);

          nanoajax.ajax({
            url: shorterAddress,
            method: 'POST',
            body: resBody
          }, function (code, response) {
            submitStatus = false;

            errTooltipControl.hideSpinner();

            if (code !== 200) {
              self.errHandler(code, response);
              return;
            }

            shortInpWrpr.classList.add('showed-shorted-link');
            //ACHTUNG! WHEN IT DISABLED, INFORMATION ISN'T GIVEN FOR THE SERVER (IF YOU WILL USE DEFAULT SUBMIT)!!!
            shortInpLink.setAttribute('disabled', 'true');
            setTimeout(function () {
              //DISABLE CANCELLING
              shortInpLink.removeAttribute('disabled');
            }, BTN_SHORT_ANIM_TIME);

            //response = JSON.parse(response);
            shortLink = response;

            self.showShortLink();
          });
        },

        showShortLink: function () {
          //FOR SYNCHRONISE WITH BUTTONS SHORTING ANIMATION
          var TXT_HIDING_TIME = BTN_SHORT_ANIM_TIME / 2;
          shortInpLink.style.color = 'rgba(18, 154, 217, 0)';

          setTimeout(function () {
            shortInpLink.value = shortLink;

            shortInpLink.style.color = '';
          }, TXT_HIDING_TIME);
        },

        errHandler: function (code, errBody) {
          switch (code) {
          case 0:
            //When server doesn't response
            errTooltipControl.showTooltip('Не удалось соединиться с сервером.');
            break;
          case 400:
            errTooltipControl.showTooltip(errBody);
            break;
          case 409:
            errTooltipControl.showTooltip(errBody);
            break;
          }
        }
      },
      Tooltip = function () {
        var //========CONSTANTS=======
          TOOLTIP_VISIBLE_TIME = 3000,
          //========================
          tooltipWrpr = document.querySelector('.tooltip-wrpr'),
          spinner = document.querySelector('.spinner'),
          txtContainer = document.querySelector('.msg-tooltip-container'),
          tooltipMsgTxt = txtContainer.querySelector('.tooltip-msg-txt'),
          mouseEnterHandler,
          mouseLeaveHandler,
          fadeOutTimeout,
          self = this;

        tooltipWrpr.querySelector('.tooltip-close-btn').addEventListener('click', function () {
          self.hideTooltip();
        });

        this.resetSpying = function () {
          clearTimeout(fadeOutTimeout);
          txtContainer.removeEventListener('mouseleave', mouseLeaveHandler);
          txtContainer.removeEventListener('mouseenter', mouseEnterHandler);
          txtContainer.classList.remove('fadeOut');
          txtContainer.classList.remove('fadeInDown');
        };


        this.showSpinner = function () {
          this.resetSpying();
          tooltipWrpr.style.display = 'block';
          txtContainer.style.display = 'none';
          spinner.style.display = 'block';
        };

        this.hideSpinner = function () {
          spinner.style.display = 'none';
        };

        this.showTooltip = function (msg) {

          //====RESET ALL=====
          this.resetSpying();


          tooltipWrpr.style.display = 'block';
          spinner.style.display = 'none';

          tooltipMsgTxt.innerHTML = msg;

          setTimeout(function () {
            txtContainer.style.display = 'block';
            txtContainer.classList.remove('fadeOut');
            txtContainer.classList.add('fadeInDown');
          }, 0);


          //============CURSOR SPYING==========
          fadeOutTimeout = setTimeout(function () {
            txtContainer.removeEventListener('mouseleave', mouseLeaveHandler);
            txtContainer.removeEventListener('mouseenter', mouseEnterHandler);
            self.hideTooltip();
          }, TOOLTIP_VISIBLE_TIME);

          mouseLeaveHandler = function () {
            fadeOutTimeout = setTimeout(function () {
              self.hideTooltip();
            }, TOOLTIP_VISIBLE_TIME);
          };

          mouseEnterHandler = function () {
            clearTimeout(fadeOutTimeout);
          };

          txtContainer.addEventListener('mouseleave', mouseLeaveHandler);
          txtContainer.addEventListener('mouseenter', mouseEnterHandler);
        };

        //FIXME[x] SPY ASYNC BUG WITH HIDETOOLTIP FUNCTION
        this.hideTooltip = function () {
          var HIDE_TOOLTIP_ANIM_TIME = 500;


          //========REMOVE CURSOR SPYING======
          clearTimeout(fadeOutTimeout);
          txtContainer.removeEventListener('mouseleave', mouseLeaveHandler);
          txtContainer.removeEventListener('mouseenter', mouseEnterHandler);


          txtContainer.classList.remove('fadeInDown');
          txtContainer.classList.add('fadeOut');
          setTimeout(function () {
            txtContainer.style.display = 'none';
            tooltipWrpr.style.display = 'none';
          }, HIDE_TOOLTIP_ANIM_TIME);
        };
      };

    function checkLinkEqual() {
      if (shortLink !== shortInpLink.value) {
        return false;
      } else {
        return true;
      }
    }
    //===============================================================


    errTooltipControl = new Tooltip();

    shorterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      //IF EQUAL, SUBMIT BTN IS TRANSFORMED IN CLEAR BTN
      if (!(checkLinkEqual()) && (shortInpLink.value !== '')) {
        submitLink.submit();
      } else {
        shortInpLink.value = '';
        shortInpWrpr.classList.remove('showed-shorted-link');
      }
    });

    shortInpLink.addEventListener('input', function () {
      if (checkLinkEqual()) {
        shortInpWrpr.classList.add('showed-shorted-link');
      } else {
        shortInpWrpr.classList.remove('showed-shorted-link');
      }
    });

    document.querySelector('.auth-btn').addEventListener('click', function (e) {
      modalToggle('.auth-modal');
    });

    //TODO PUT IN THE OTHER FILE

    
    var FORM_HEIGHT = 174,//Description: constants is used for animation, because for
        ENLARGED_FORM_HEIGHT = 279,//CSS animation needs determined value. I will be rewrited to automatic refreshing form.
        //Variables
        namedCheckBox = document.querySelector('.named-link-checkbox'),
        isNamedLink = false;
    
    shorterForm.style.height = FORM_HEIGHT + 'px';//Determine height value for first call
                                                  //of showNamedInput
    
    function showNamedInput() {
      shorterForm.style.height = ENLARGED_FORM_HEIGHT + 'px';
      
      shortInpLink.classList.add('shorter-inp-named');
      
      shortInpBtn.style.opacity = '0';
      shortInpBtn.classList.remove('inp-short-name-anim-in');
      shortInpBtn.classList.add('inp-short-name-anim-in');
      shortInpBtn.classList.add('shorter-submit-btn-named');

      shortInpName.style.display = 'inline-block';
      shortInpName.classList.remove('inp-short-name-anim-out');
      shortInpName.classList.add('inp-short-name-anim-in');
      namedCheckBox.checked = true;
      
    }

    function hideNamedInput() {
      var ANIM_DURATION = 600;

      shortInpName.classList.remove('inp-short-name-anim-in');
      shortInpName.classList.add('inp-short-name-anim-out');

      shortInpBtn.classList.remove('inp-short-name-anim-in');
      shortInpBtn.classList.add('inp-short-name-anim-out');
      
      shorterForm.style.height = FORM_HEIGHT + 'px';
      
      setTimeout(function () {
        shortInpLink.classList.remove('shorter-inp-named');
        
        shortInpBtn.classList.remove('shorter-submit-btn-named');
        shortInpBtn.classList.remove('inp-short-name-anim-out');
        shortInpBtn.classList.add('inp-short-name-anim-in');
        
        shortInpName.style.display = '';
        namedCheckBox.checked = false;
      }, ANIM_DURATION);
    }

    namedCheckBox.addEventListener('change', function (e) {
      if (this.checked) {
        showNamedInput();
        isNamedLink = true;
      } else {
        hideNamedInput();
        isNamedLink = false;
      }
    });
  }
})();