const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const contactFields = ["name", "email", "message"].map((id) => document.querySelector(`#${id}`));
const projectModal = document.querySelector("#project-modal");
const modalCloseButton = document.querySelector(".modal-close");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalRole = document.querySelector("#modal-role");
const modalTechnologies = document.querySelector("#modal-technologies");
const modalOutcome = document.querySelector("#modal-outcome");

const projectDetails = {
  lumio: {
    name: "Lumio",
    description: "여러 금융 정보를 한곳에서 확인하고 이해하기 쉽게 정리하는 자산관리 서비스입니다.",
    role: "제품 기획 협업, UX 리서치, 사용자 흐름 및 UI 디자인",
    technologies: ["Figma", "FigJam", "Prototyping"],
    outcome: "핵심 자산 정보를 확인하는 단계를 줄이고, 사용성 테스트에서 주요 화면 이해도를 높였습니다."
  },
  mori: {
    name: "Mori",
    description: "느긋한 일상의 순간을 소개하고 취향에 맞는 상품을 발견하도록 돕는 라이프스타일 브랜드입니다.",
    role: "브랜드 방향성 정리, 비주얼 아이덴티티, 온라인 스토어 디자인",
    technologies: ["Figma", "Illustrator", "Shopify"],
    outcome: "브랜드의 시각 언어를 온라인 경험 전반에 일관되게 적용하고 상품 탐색 흐름을 개선했습니다."
  },
  ondo: {
    name: "Ondo Studio",
    description: "동네의 공간과 창작자를 소개해 사용자와 지역의 새로운 만남을 만드는 큐레이션 서비스입니다.",
    role: "서비스 컨셉 정의, 정보 구조 설계, 반응형 웹 UI 디자인",
    technologies: ["Figma", "FigJam", "HTML", "CSS"],
    outcome: "장소와 주제별 탐색을 단순화하고, 지역 콘텐츠를 발견하는 경로를 명확하게 구성했습니다."
  }
};

let lastFocusedElement = null;

// 저장된 테마를 적용하고 토글 버튼의 접근성 정보를 함께 갱신합니다.
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  themeToggle.title = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";
  themeIcon.textContent = isDark ? "☀" : "☾";
}

const savedTheme = localStorage.getItem("portfolio-theme");
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  applyTheme(nextTheme);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// 선택한 프로젝트의 상세 내용을 모달에 표시하고 포커스를 이동합니다.
function openProjectModal(projectId, trigger) {
  const project = projectDetails[projectId];
  if (!project) {
    throw new Error(`프로젝트 상세 데이터를 찾을 수 없습니다: ${projectId}`);
  }

  lastFocusedElement = trigger;
  modalTitle.textContent = project.name;
  modalDescription.textContent = project.description;
  modalRole.textContent = project.role;
  modalOutcome.textContent = project.outcome;
  modalTechnologies.replaceChildren(...project.technologies.map((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    return item;
  }));
  trigger.setAttribute("aria-expanded", "true");
  projectModal.hidden = false;
  document.body.classList.add("modal-open");
  modalCloseButton.focus();
}

// 모달을 닫고 열기 전 프로젝트 카드로 키보드 포커스를 돌려보냅니다.
function closeProjectModal() {
  if (projectModal.hidden) {
    return;
  }

  projectModal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocusedElement?.setAttribute("aria-expanded", "false");
  lastFocusedElement?.focus();
  lastFocusedElement = null;
}

// 모달이 열린 동안 Tab 포커스가 모달 밖으로 나가지 않도록 합니다.
function keepFocusInsideModal(event) {
  const focusableElements = projectModal.querySelectorAll("button:not([disabled])");
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

document.querySelectorAll(".project-card-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openProjectModal(trigger.dataset.project, trigger);
  });
});

modalCloseButton.addEventListener("click", closeProjectModal);

projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (projectModal.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeProjectModal();
  } else if (event.key === "Tab") {
    keepFocusInsideModal(event);
  }
});

// 입력 오류를 표시하고 해당 필드의 접근성 상태를 갱신합니다.
function showFieldError(field, message) {
  const errorMessage = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", "true");
  errorMessage.textContent = message;
}

// 필수 입력값과 이메일 형식을 검사하고 첫 번째 오류 필드에 포커스를 둡니다.
function validateContactForm() {
  let firstInvalidField = null;
  const [nameField, emailField, messageField] = contactFields;

  contactFields.forEach((field) => {
    field.setAttribute("aria-invalid", "false");
    document.querySelector(`#${field.id}-error`).textContent = "";
  });

  if (!nameField.value.trim()) {
    showFieldError(nameField, "이름을 입력해 주세요.");
    firstInvalidField = nameField;
  }

  if (!emailField.value.trim()) {
    showFieldError(emailField, "이메일 주소를 입력해 주세요.");
    if (!firstInvalidField) firstInvalidField = emailField;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
    showFieldError(emailField, "올바른 이메일 주소를 입력해 주세요. (예: hello@email.com)");
    if (!firstInvalidField) firstInvalidField = emailField;
  }

  if (!messageField.value.trim()) {
    showFieldError(messageField, "메시지를 입력해 주세요.");
    if (!firstInvalidField) firstInvalidField = messageField;
  }

  if (firstInvalidField) {
    firstInvalidField.focus();
    return false;
  }

  return true;
}

contactFields.forEach((field) => {
  field.addEventListener("input", () => {
    field.setAttribute("aria-invalid", "false");
    document.querySelector(`#${field.id}-error`).textContent = "";
    formStatus.textContent = "";
    formStatus.classList.remove("is-error", "is-success");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  formStatus.textContent = "";
  formStatus.classList.remove("is-error", "is-success");

  if (!validateContactForm()) {
    formStatus.textContent = "입력 항목을 확인하고 수정해 주세요.";
    formStatus.classList.add("is-error");
    return;
  }

  const name = contactFields[0].value.trim();
  contactForm.reset();
  formStatus.textContent = `${name}님, 입력 내용이 모두 확인되었습니다. (실제 이메일은 전송되지 않았습니다.)`;
  formStatus.classList.add("is-success");
});

document.querySelector("#year").textContent = new Date().getFullYear();
