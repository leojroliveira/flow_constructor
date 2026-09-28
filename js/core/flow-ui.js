function connector(extraClass = "") {
  return `<div class="connector ${extraClass}"></div>`;
}

function getRightLineStyle(successfulIndexes, branchCount) {
  if (successfulIndexes.length === 0 || branchCount === 0) {
    return "";
  }

  const branchHeight = 120;
  const totalHeight = branchCount * branchHeight;
  const flowCenter = totalHeight / 2;
  const successfulCenters = successfulIndexes.map(
    index => (index * branchHeight) + (branchHeight / 2)
  );
  const top = Math.min(flowCenter, ...successfulCenters);
  const bottom = totalHeight - Math.max(flowCenter, ...successfulCenters);

  return `style="--right-line-top:${top}px;--right-line-bottom:${bottom}px"`;
}

function alignBranchConnectors() {
  document.querySelectorAll(".branches").forEach(container => {
    let rows = Array.from(container.querySelectorAll(":scope > .branch"));
    if (!rows.length) return;

    // Equaliza o espaço externo para que o centro visual da bifurcação
    // coincida exatamente com o conector e com a caixa seguinte.
    container.style.paddingTop = "0px";
    container.style.paddingBottom = "0px";
    const rawFirstCenter = rows[0].offsetTop + (rows[0].offsetHeight / 2);
    const rawLast = rows[rows.length - 1];
    const rawLastCenter = rawLast.offsetTop + (rawLast.offsetHeight / 2);
    const visualCenter = (rawFirstCenter + rawLastCenter) / 2;
    const centerDifference = visualCenter - (container.offsetHeight / 2);

    if (Math.abs(centerDifference) >= 0.5) {
      if (centerDifference > 0) {
        container.style.paddingBottom = `${centerDifference * 2}px`;
      } else {
        container.style.paddingTop = `${Math.abs(centerDifference) * 2}px`;
      }
      rows = Array.from(container.querySelectorAll(":scope > .branch"));
    }

    const firstCenter = rows[0].offsetTop + (rows[0].offsetHeight / 2);
    const last = rows[rows.length - 1];
    const lastCenter = last.offsetTop + (last.offsetHeight / 2);
    container.style.setProperty("--left-line-top", `${firstCenter}px`);
    container.style.setProperty(
      "--left-line-bottom",
      `${Math.max(0, container.offsetHeight - lastCenter)}px`
    );

    const entryConnector = container.previousElementSibling;
    if (entryConnector?.classList.contains("branch-entry-connector")) {
      const middleIndex = Math.floor(rows.length / 2);
      const middleCenter = rows.length % 2 === 1
        ? rows[middleIndex].offsetTop + (rows[middleIndex].offsetHeight / 2)
        : (
            rows[middleIndex - 1].offsetTop + (rows[middleIndex - 1].offsetHeight / 2) +
            rows[middleIndex].offsetTop + (rows[middleIndex].offsetHeight / 2)
          ) / 2;
      entryConnector.style.transform = `translateY(${middleCenter - (container.offsetHeight / 2)}px)`;
    }

    const advancingRows = rows.filter(row =>
      !row.classList.contains("hide-exit-line")
    );
    if (!advancingRows.length) return;

    const flowCenter = container.offsetHeight / 2;
    const advancingCenters = advancingRows.map(row =>
      row.offsetTop + (row.offsetHeight / 2)
    );
    container.style.setProperty(
      "--right-line-top",
      `${Math.min(flowCenter, ...advancingCenters)}px`
    );
    container.style.setProperty(
      "--right-line-bottom",
      `${Math.max(0, container.offsetHeight - Math.max(flowCenter, ...advancingCenters))}px`
    );
  });
}

function alignProcessDivider() {
  const divider = document.querySelector(".process-divider:not(.state-waiting)");
  const frequencyBox = document.querySelector(".frequency-box:not(.state-waiting)");
  if (!divider || !frequencyBox) return;

  const label = divider.querySelector(".process-divider-label");
  const paymentBranches = document.querySelector(".payment-branches:not(.state-waiting)");
  const labelHeight = label?.offsetHeight || 28;
  const frequencyHeight = frequencyBox.offsetHeight;
  const paymentHeight = paymentBranches?.offsetHeight || 0;
  const requiredHeight = Math.max(
    320,
    frequencyHeight + labelHeight + 48,
    paymentHeight
  );

  divider.style.minHeight = `${requiredHeight}px`;

  if (label) {
    const frequencyTop = (divider.offsetHeight - frequencyHeight) / 2;
    label.style.top = `${Math.max(8, frequencyTop - labelHeight - 10)}px`;
  }
}

function actionButtons(type, index, acceptLabel, rejectLabel) {
  const indexAttribute = index === undefined ? "" : `data-index="${index}"`;

  return `
    <div class="box-actions">
      <button
        class="button button-primary"
        data-action="${type}"
        data-value="approved"
        ${indexAttribute}
      >${acceptLabel}</button>
      <button
        class="button button-danger"
        data-action="${type}"
        data-value="rejected"
        ${indexAttribute}
      >${rejectLabel}</button>
    </div>
  `;
}

function processBox({ title, subtitle, icon, stateClass, actions = "", extraClass = "" }) {
  const eventIcon = extraClass.includes("event")
    ? `<span class="box-icon">${icon}</span>`
    : "";

  return `
    <div class="process-box ${stateClass} ${extraClass}">
      ${eventIcon}
      <strong>${title}</strong>
      <small>${subtitle}</small>
      ${actions}
    </div>
  `;
}

function branchBox(title, subtitle, stateClass, actions = "") {
  return `
    <div class="branch-box ${stateClass}">
      <strong>${title}</strong>
      <small>${subtitle}</small>
      ${actions}
    </div>
  `;
}

function decisionStatus(code, label, type) {
  return `
    <span
      class="decision-status decision-${type}"
      title="${code} - ${label}"
    >
      <span class="status-circle" aria-hidden="true"></span>
      ${code} - ${label}
    </span>
  `;
}
