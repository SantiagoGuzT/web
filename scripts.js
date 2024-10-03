document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("survey-form");
    const progressBar = document.getElementById("progress-bar");
  
    const modal = document.getElementById("confirmation-modal");
    const closeButton = document.querySelector(".close-button");
  
    const enableOtherField = (radioName, otherRadioId, otherInputId) => {
      const otherRadio = document.getElementById(otherRadioId);
      const otherInput = document.getElementById(otherInputId);
  
      otherRadio.addEventListener("change", () => {
        if (otherRadio.checked) {
          otherInput.disabled = false;
          otherInput.focus();
        }
      });

      const radios = document.querySelectorAll(`input[name="${radioName}"]`);
      radios.forEach(radio => {
        if (radio.id !== otherRadioId) {
          radio.addEventListener("change", () => {
            if (!otherRadio.checked) {
              otherInput.disabled = true;
              otherInput.value = "";
            }
          });
        }
      });
    };
  
    enableOtherField("tipo", "tipo-otro-radio", "tipo-otro");
    enableOtherField("presentacion", "presentacion-otro-radio", "presentacion-otro");
    enableOtherField("factores", "factores-otro-radio", "factores-otro");
  
    const openModal = () => {
      modal.style.display = "flex";
    };
  
    const closeModal = () => {
      modal.style.display = "none";
    };
  
    closeButton.addEventListener("click", closeModal);
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  
    const validateField = (field, errorField, condition, message) => {
      if (condition) {
        errorField.style.display = "none";
        return true;
      } else {
        errorField.textContent = message;
        errorField.style.display = "block";
        return false;
      }
    };
  
    const updateProgressBar = () => {
      const totalFields = 5;
      let filledFields = 0;
  
      if (document.getElementById("frecuencia").value !== "") filledFields++;
  
      const tipoSeleccionado = document.querySelector("input[name='tipo']:checked");
      if (tipoSeleccionado) {
        if (tipoSeleccionado.value !== "Otro" || (tipoSeleccionado.value === "Otro" && document.getElementById("tipo-otro").value.trim() !== "")) {
          filledFields++;
        }
      }
  
      const presentacionSeleccionada = document.querySelector("input[name='presentacion']:checked");
      if (presentacionSeleccionada) {
        if (presentacionSeleccionada.value !== "Otro" || (presentacionSeleccionada.value === "Otro" && document.getElementById("presentacion-otro").value.trim() !== "")) {
          filledFields++;
        }
      }
  
      if (document.getElementById("precio").value !== "") filledFields++;
  
      const factoresSeleccionado = document.querySelector("input[name='factores']:checked");
      if (factoresSeleccionado) {
        if (factoresSeleccionado.value !== "Otro" || (factoresSeleccionado.value === "Otro" && document.getElementById("factores-otro").value.trim() !== "")) {
          filledFields++;
        }
      }
  
      const progressPercentage = (filledFields / totalFields) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    };
  
    form.addEventListener("input", updateProgressBar);
    form.addEventListener("change", updateProgressBar);
  
    form.addEventListener("submit", function(event) {
      event.preventDefault();
  
      let isValid = true;
  
      const frecuencia = document.getElementById("frecuencia");
      const frecuenciaError = document.getElementById("frecuencia-error");
      isValid &= validateField(
        frecuencia,
        frecuenciaError,
        frecuencia.value !== "",
        "Este campo es obligatorio."
      );
  
      const tipoSeleccionado = document.querySelector("input[name='tipo']:checked");
      const tipoError = document.getElementById("tipo-error");
      if (tipoSeleccionado) {
        if (tipoSeleccionado.value === "Otro") {
          const tipoOtro = document.getElementById("tipo-otro");
          isValid &= validateField(
            tipoOtro,
            tipoError,
            tipoOtro.value.trim() !== "",
            "Por favor, especifica el tipo de chocolate."
          );
        } else {
          tipoError.style.display = "none";
        }
      } else {
        tipoError.textContent = "Este campo es obligatorio.";
        tipoError.style.display = "block";
        isValid = false;
      }
  
      const presentacionSeleccionada = document.querySelector("input[name='presentacion']:checked");
      const presentacionError = document.getElementById("presentacion-error");
      if (presentacionSeleccionada) {
        if (presentacionSeleccionada.value === "Otro") {
          const presentacionOtro = document.getElementById("presentacion-otro");
          isValid &= validateField(
            presentacionOtro,
            presentacionError,
            presentacionOtro.value.trim() !== "",
            "Por favor, especifica la presentación de chocolate."
          );
        } else {
          presentacionError.style.display = "none";
        }
      } else {
        presentacionError.textContent = "Este campo es obligatorio.";
        presentacionError.style.display = "block";
        isValid = false;
      }
  
      const precio = document.getElementById("precio");
      const precioError = document.getElementById("precio-error");
      isValid &= validateField(
        precio,
        precioError,
        precio.value !== "",
        "Este campo es obligatorio."
      );
  
      const factoresSeleccionado = document.querySelector("input[name='factores']:checked");
      const factoresError = document.getElementById("factores-error");
      if (factoresSeleccionado) {
        if (factoresSeleccionado.value === "Otro") {
          const factoresOtro = document.getElementById("factores-otro");
          isValid &= validateField(
            factoresOtro,
            factoresError,
            factoresOtro.value.trim() !== "",
            "Por favor, especifica el factor importante."
          );
        } else {
          factoresError.style.display = "none";
        }
      } else {
        factoresError.textContent = "Este campo es obligatorio.";
        factoresError.style.display = "block";
        isValid = false;
      }
  
      if (isValid) {
        const respuestas = {
          frecuencia: frecuencia.value,
          tipo: tipoSeleccionado.value === "Otro" ? document.getElementById("tipo-otro").value : tipoSeleccionado.value,
          presentacion: presentacionSeleccionada.value === "Otro" ? document.getElementById("presentacion-otro").value : presentacionSeleccionada.value,
          precio: precio.value,
          factores: factoresSeleccionado.value === "Otro" ? document.getElementById("factores-otro").value : factoresSeleccionado.value
        };
  
        localStorage.setItem("respuestasEncuesta", JSON.stringify(respuestas));
  
        openModal();
  
        form.reset();
  
        progressBar.style.width = "0%";
  
        document.getElementById("tipo-otro").disabled = true;
        document.getElementById("presentacion-otro").disabled = true;
        document.getElementById("factores-otro").disabled = true;
  
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach(error => error.style.display = "none");
      } else {
        const firstError = document.querySelector(".error-message[style*='block']");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  
    const saveFormData = () => {
      const respuestas = {
        frecuencia: document.getElementById("frecuencia").value,
        tipo: (() => {
          const tipoSeleccionado = document.querySelector("input[name='tipo']:checked");
          if (tipoSeleccionado) {
            return tipoSeleccionado.value === "Otro" ? document.getElementById("tipo-otro").value : tipoSeleccionado.value;
          }
          return "";
        })(),
        presentacion: (() => {
          const presentacionSeleccionada = document.querySelector("input[name='presentacion']:checked");
          if (presentacionSeleccionada) {
            return presentacionSeleccionada.value === "Otro" ? document.getElementById("presentacion-otro").value : presentacionSeleccionada.value;
          }
          return "";
        })(),
        precio: document.getElementById("precio").value,
        factores: (() => {
          const factoresSeleccionado = document.querySelector("input[name='factores']:checked");
          if (factoresSeleccionado) {
            return factoresSeleccionado.value === "Otro" ? document.getElementById("factores-otro").value : factoresSeleccionado.value;
          }
          return "";
        })()
      };
      localStorage.setItem("respuestasEncuesta", JSON.stringify(respuestas));
    };
  
    form.addEventListener("input", saveFormData);
    form.addEventListener("change", saveFormData);
  
    const cargarRespuestas = () => {
      const respuestasGuardadas = localStorage.getItem("respuestasEncuesta");
      if (respuestasGuardadas) {
        const respuestas = JSON.parse(respuestasGuardadas);
  
        if (respuestas.frecuencia) {
          document.getElementById("frecuencia").value = respuestas.frecuencia;
        }
  
        if (respuestas.tipo) {
          const tipoRadio = Array.from(document.querySelectorAll("input[name='tipo']")).find(radio => radio.value === respuestas.tipo);
          if (tipoRadio) {
            tipoRadio.checked = true;
          } else {
            document.getElementById("tipo-otro-radio").checked = true;
            document.getElementById("tipo-otro").disabled = false;
            document.getElementById("tipo-otro").value = respuestas.tipo;
          }
        }
  
        if (respuestas.presentacion) {
          const presentacionRadio = Array.from(document.querySelectorAll("input[name='presentacion']")).find(radio => radio.value === respuestas.presentacion);
          if (presentacionRadio) {
            presentacionRadio.checked = true;
          } else {
            document.getElementById("presentacion-otro-radio").checked = true;
            document.getElementById("presentacion-otro").disabled = false;
            document.getElementById("presentacion-otro").value = respuestas.presentacion;
          }
        }
  
        if (respuestas.precio) {
          document.getElementById("precio").value = respuestas.precio;
        }
  
        if (respuestas.factores) {
          const factoresRadio = Array.from(document.querySelectorAll("input[name='factores']")).find(radio => radio.value === respuestas.factores);
          if (factoresRadio) {
            factoresRadio.checked = true;
          } else {
            document.getElementById("factores-otro-radio").checked = true;
            document.getElementById("factores-otro").disabled = false;
            document.getElementById("factores-otro").value = respuestas.factores;
          }
        }
  
        updateProgressBar();
      }
    };
  
    cargarRespuestas();
  
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = `
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    `;
    const nav = document.querySelector('nav');
    nav.appendChild(menuToggle);
  
    menuToggle.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  });
  