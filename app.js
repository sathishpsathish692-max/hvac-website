/* ==========================================================================
   AEROTHERMA AI - APPLICATION CONTROLLER & AUTOMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThermalModes();
  initHubTabs();
  initDiagnosticEngine();
  initManualJCalculator();
  initTelemetrySimulator();
  initDispatchEngine();
  initServiceAreaZipChecker();
  initBlogFaqInteractions();
  initCustomerPortal();
  initContactForm();
  initFloatingAiChat();
  initMobileNav();
  initCounters();
});

/* --------------------------------------------------------------------------
   1. THERMAL THEME MODES (Cooling / Balanced / Heating)
   -------------------------------------------------------------------------- */
function initThermalModes() {
  const modeButtons = document.querySelectorAll('.mode-btn');
  const body = document.body;

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      body.setAttribute('data-thermal-mode', mode);

      const livePulse = document.querySelector('.live-pulse-dot');
      if (livePulse) {
        livePulse.style.transform = 'scale(1.4)';
        setTimeout(() => livePulse.style.transform = '', 300);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. AI COMMAND HUB TABS NAVIGATION
   -------------------------------------------------------------------------- */
function initHubTabs() {
  const tabBtns = document.querySelectorAll('.hub-tab-btn');
  const tabPanels = document.querySelectorAll('.hub-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function switchToTab(tabId) {
  const targetBtn = document.querySelector(`.hub-tab-btn[data-tab="${tabId}"]`);
  if (targetBtn) {
    targetBtn.click();
    targetBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* --------------------------------------------------------------------------
   3. AI DIAGNOSTIC CO-PILOT (Symptom & Fault Tree Triage)
   -------------------------------------------------------------------------- */
function initDiagnosticEngine() {
  const symptomChips = document.querySelectorAll('.symptom-chip');
  const pillOptions = document.querySelectorAll('#systemTypeSelector .pill-option');
  const runBtn = document.getElementById('runDiagnosticBtn');
  const overlay = document.getElementById('diagProcessing');
  const placeholder = document.getElementById('diagPlaceholder');
  const resultView = document.getElementById('diagResultView');
  const sampleChips = document.querySelectorAll('.chip-sample');

  // Toggle symptom chip selection
  symptomChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // Toggle system type selector
  pillOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      pillOptions.forEach(p => p.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Handle quick sample scenarios
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const sample = chip.getAttribute('data-sample');
      symptomChips.forEach(c => c.classList.remove('selected'));

      if (sample === 'capacitor') {
        const warm = document.querySelector('.symptom-chip[data-symptom="warm_air"]');
        const bang = document.querySelector('.symptom-chip[data-symptom="banging_noise"]');
        if (warm) warm.classList.add('selected');
        if (bang) bang.classList.add('selected');
        document.getElementById('errorCodeInput').value = '';
        document.getElementById('customIssueText').value = 'Outside compressor hums loudly every 40 seconds but fan is not spinning.';
      } else if (sample === 'drain') {
        const leak = document.querySelector('.symptom-chip[data-symptom="water_leak"]');
        const blank = document.querySelector('.symptom-chip[data-symptom="no_power"]');
        if (leak) leak.classList.add('selected');
        if (blank) blank.classList.add('selected');
        document.getElementById('errorCodeInput').value = 'Float Switch';
        document.getElementById('customIssueText').value = 'Water backing up in the drain pan and thermostat went totally blank.';
      } else if (sample === 'freon') {
        const frozen = document.querySelector('.symptom-chip[data-symptom="frozen_coil"]');
        const warm = document.querySelector('.symptom-chip[data-symptom="warm_air"]');
        if (frozen) frozen.classList.add('selected');
        if (warm) warm.classList.add('selected');
        document.getElementById('errorCodeInput').value = 'Low Pressure E3';
        document.getElementById('customIssueText').value = 'Large ice block forming on refrigerant suction line outside.';
      }

      runDiagnosticSimulation();
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runDiagnosticSimulation();
    });
  }

  function runDiagnosticSimulation() {
    const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-chip.selected')).map(c => c.getAttribute('data-symptom'));
    const brand = document.getElementById('brandSelect').value;
    const errorCode = document.getElementById('errorCodeInput').value.trim();
    const customText = document.getElementById('customIssueText').value.trim();

    overlay.style.display = 'flex';
    placeholder.style.display = 'none';
    resultView.style.display = 'none';

    const steps = overlay.querySelectorAll('.step-item');
    steps.forEach((s, i) => {
      s.classList.remove('active');
      if (i === 0) s.classList.add('active');
    });

    setTimeout(() => {
      if (steps[1]) {
        steps[0].classList.remove('active');
        steps[1].classList.add('active');
      }
    }, 600);

    setTimeout(() => {
      if (steps[2]) {
        steps[1].classList.remove('active');
        steps[2].classList.add('active');
      }
    }, 1100);

    setTimeout(() => {
      overlay.style.display = 'none';
      renderDiagnosticResults(selectedSymptoms, brand, errorCode, customText);
      resultView.style.display = 'flex';
    }, 1600);
  }

  function renderDiagnosticResults(symptoms, brand, errorCode, customText) {
    let urgency = 'urgency-high';
    let urgencyLabel = 'HIGH PRIORITY';
    let title = 'Failed Dual-Run Capacitor or Contactor Pit';
    let description = 'The compressor and condenser fan motor are failing to start due to degraded capacitance microfarad (µF) tolerance. The system is pulling locked-rotor amperage (LRA), triggering internal thermal overload protection.';
    let estCost = '$180 - $290';
    let safetyAlert = 'Turn off thermostat to COOL=OFF at the wall immediately to prevent permanent compressor motor winding burnout.';
    let diyAction = 'Professional EPA/NATE Certified repair required. High-voltage 440V stored capacitive charge present inside cabinet.';
    let confidence = '98.2%';

    if (symptoms.includes('frozen_coil') || errorCode.toLowerCase().includes('pressure') || customText.toLowerCase().includes('ice')) {
      urgency = 'urgency-critical';
      urgencyLabel = 'CRITICAL ATTENTION';
      title = 'Severe Evaporator Freeze & Subcooling Drop (Refrigerant Leak / Starvation)';
      description = 'Severe thermodynamic disruption. Low suction saturation temperature caused liquid refrigerant to boil below 32°F, freezing ambient humidity on coils. Possible micro-leak at indoor U-bends or failed TXV expansion valve.';
      estCost = '$280 - $650 (Leak test & recharge)';
      safetyAlert = 'Shut off system immediately and set FAN to ON to begin 4-hour thawing. Do NOT chip away ice with sharp objects.';
      diyAction = 'Check air filter for 100% blockage first. If clean, refrigerant circuits must be pressurized with dry nitrogen for leak pinpointing.';
      confidence = '96.8%';
    } else if (symptoms.includes('water_leak') || errorCode.toLowerCase().includes('float') || symptoms.includes('no_power')) {
      urgency = 'urgency-normal';
      urgencyLabel = 'MODERATE / SAFETY SHUTOFF';
      title = 'Tripped Condensate Overflow Float Switch & Algae Clog';
      description = 'Safety mechanism activated. The primary drain line is clogged with fungal biofilm, triggering the secondary Safe-T-Switch to cut 24V R-wire power to the thermostat to prevent ceiling drywall flooding.';
      estCost = '$120 - $210 (Clear line & chemical tab install)';
      safetyAlert = 'Inspect indoor drain pan for standing water before restoring any power switches.';
      diyAction = 'Potential DIY: Flush drain line with wet/dry vac or 50/50 vinegar flush. If persistent, tech will clear with high-pressure nitrogen.';
      confidence = '99.1%';
    } else if (symptoms.includes('furnace_click') || errorCode.toLowerCase().includes('33') || errorCode.toLowerCase().includes('flash')) {
      urgency = 'urgency-critical';
      urgencyLabel = 'HEATING SYSTEM LOCKOUT';
      title = 'Oxidized Flame Sensor or Hot Surface Igniter (HSI) Breakdown';
      description = `The ${brand} ignition control module senses microamp flame current below safety threshold (0.5 µA). The gas valve opens for 4 seconds then closes to prevent unburned natural gas accumulation.`;
      estCost = '$150 - $320';
      safetyAlert = 'Gas valve locked out for safety. Do NOT repeatedly cycle the breaker if you smell gas odor.';
      diyAction = 'Cleaning flame rod with ultra-fine steel wool may resolve temporarily; inspection of draft inducer pressure switch recommended.';
      confidence = '97.4%';
    }

    resultView.innerHTML = `
      <div class="diag-summary-header">
        <span class="diag-urgency-badge ${urgency}">${urgencyLabel}</span>
        <span class="diag-confidence">AI Confidence Score: <strong>${confidence}</strong></span>
      </div>

      <div class="root-cause-card">
        <h4 class="root-cause-title">${title}</h4>
        <p class="root-cause-desc">${description}</p>
      </div>

      <div class="diag-breakdown-grid">
        <div class="diag-box">
          <div class="diag-box-label">Target Equipment</div>
          <div class="diag-box-val text-white">${brand} ${errorCode ? `• Code ${errorCode}` : ''}</div>
        </div>
        <div class="diag-box">
          <div class="diag-box-label">Estimated Repair Range</div>
          <div class="diag-box-val text-cyan">${estCost}</div>
        </div>
      </div>

      <div class="diy-safety-banner">
        <span>⚠️</span>
        <div>
          <strong>Immediate Safety Directive:</strong> ${safetyAlert}
        </div>
      </div>

      <div class="diag-box">
        <div class="diag-box-label">Resolution Protocol:</div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">${diyAction}</p>
      </div>

      <button type="button" class="btn btn-schedule-highlight btn-full" id="diagToDispatchBtn">
        <span class="schedule-pulse"></span>
        <span>Route Tech with Pre-Filled Diagnosis Report →</span>
      </button>
    `;

    const toDispatchBtn = document.getElementById('diagToDispatchBtn');
    if (toDispatchBtn) {
      toDispatchBtn.addEventListener('click', () => {
        const notesInput = document.getElementById('techNotes');
        if (notesInput) {
          notesInput.value = `[AI Diagnostic Pre-Fill] ${brand} System. Fault: ${title}. Est: ${estCost}.`;
        }
        switchToTab('tab-dispatch');
      });
    }
  }
}

/* --------------------------------------------------------------------------
   4. MANUAL J HEAT LOAD & SIZING CALCULATOR
   -------------------------------------------------------------------------- */
function initManualJCalculator() {
  const sqftSlider = document.getElementById('sqftSlider');
  const sqftValue = document.getElementById('sqftValue');
  const ceilingSlider = document.getElementById('ceilingSlider');
  const ceilingValue = document.getElementById('ceilingValue');
  const climateZone = document.getElementById('climateZone');
  const insulationGrade = document.getElementById('insulationGrade');
  const efficiencyPills = document.querySelectorAll('#efficiencyTargetSelector .pill-option');

  const calcTons = document.getElementById('calcTons');
  const calcBtu = document.getElementById('calcBtu');
  const calcSystemTitle = document.getElementById('calcSystemTitle');
  const calcSavings = document.getElementById('calcSavings');
  const calcNetPrice = document.getElementById('calcNetPrice');
  const toDispatchBtn = document.getElementById('calcToDispatchBtn');

  let currentTier = 'premium';

  if (efficiencyPills) {
    efficiencyPills.forEach(pill => {
      pill.addEventListener('click', () => {
        efficiencyPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentTier = pill.getAttribute('data-tier');
        recompute();
      });
    });
  }

  if (sqftSlider) sqftSlider.addEventListener('input', () => {
    sqftValue.textContent = `${Number(sqftSlider.value).toLocaleString()} sq ft`;
    recompute();
  });

  if (ceilingSlider) ceilingSlider.addEventListener('input', () => {
    ceilingValue.textContent = `${ceilingSlider.value} Feet`;
    recompute();
  });

  if (climateZone) climateZone.addEventListener('change', recompute);
  if (insulationGrade) insulationGrade.addEventListener('change', recompute);

  function recompute() {
    if (!sqftSlider) return;
    const sqft = parseFloat(sqftSlider.value) || 2400;
    const ceiling = parseFloat(ceilingSlider.value) || 9;
    const zone = climateZone ? climateZone.value : 'zone2';
    const insulation = insulationGrade ? insulationGrade.value : 'average';

    let btuPerSqft = 20;
    if (zone === 'zone1') btuPerSqft = 26;
    if (zone === 'zone2') btuPerSqft = 20;
    if (zone === 'zone3') btuPerSqft = 24;
    if (zone === 'zone4') btuPerSqft = 29;
    if (zone === 'zone5') btuPerSqft = 28;

    const ceilingFactor = ceiling / 8.0;

    let insulFactor = 1.0;
    if (insulation === 'poor') insulFactor = 1.25;
    if (insulation === 'superior') insulFactor = 0.82;

    const rawBtu = sqft * btuPerSqft * ceilingFactor * insulFactor;
    let rawTons = rawBtu / 12000;
    let roundedTons = Math.round(rawTons * 2) / 2;
    if (roundedTons < 1.5) roundedTons = 1.5;
    if (roundedTons > 6.0) roundedTons = 6.0;

    const totalDesignBtu = roundedTons * 12000;

    if (calcTons) calcTons.textContent = roundedTons.toFixed(1);
    if (calcBtu) calcBtu.textContent = totalDesignBtu.toLocaleString();

    if (currentTier === 'premium') {
      if (calcSystemTitle) calcSystemTitle.textContent = `Daikin Fit™ Inverter (20.5 SEER2 • ${roundedTons} Ton)`;
      if (calcSavings) calcSavings.textContent = `$${Math.round(roundedTons * 340).toLocaleString()} / yr`;
      const basePrice = roundedTons * 2800 + 1500;
      const netLow = Math.round(basePrice - 2000 - 800);
      const netHigh = Math.round(netLow + 1400);
      if (calcNetPrice) calcNetPrice.textContent = `$${netLow.toLocaleString()} - $${netHigh.toLocaleString()}`;
    } else if (currentTier === 'standard') {
      if (calcSystemTitle) calcSystemTitle.textContent = `Carrier Performance™ Heat Pump (17 SEER2 • ${roundedTons} Ton)`;
      if (calcSavings) calcSavings.textContent = `$${Math.round(roundedTons * 240).toLocaleString()} / yr`;
      const basePrice = roundedTons * 2300 + 1200;
      const netLow = Math.round(basePrice - 2000 - 500);
      const netHigh = Math.round(netLow + 1100);
      if (calcNetPrice) calcNetPrice.textContent = `$${netLow.toLocaleString()} - $${netHigh.toLocaleString()}`;
    } else {
      if (calcSystemTitle) calcSystemTitle.textContent = `Bosch IDS 2.0 Dual-Fuel Hybrid (18.5 SEER2 + 96% Gas AFUE)`;
      if (calcSavings) calcSavings.textContent = `$${Math.round(roundedTons * 290).toLocaleString()} / yr`;
      const basePrice = roundedTons * 2950 + 1900;
      const netLow = Math.round(basePrice - 2000 - 750);
      const netHigh = Math.round(netLow + 1500);
      if (calcNetPrice) calcNetPrice.textContent = `$${netLow.toLocaleString()} - $${netHigh.toLocaleString()}`;
    }
  }

  if (toDispatchBtn) {
    toDispatchBtn.addEventListener('click', () => {
      const notesInput = document.getElementById('techNotes');
      const urgencySelect = document.getElementById('dispatchUrgency');
      if (notesInput && calcTons && calcSystemTitle) {
        notesInput.value = `[Manual J Sizing] Site visit for ${calcTons.textContent} Ton system (${calcSystemTitle.textContent}).`;
      }
      if (urgencySelect) urgencySelect.value = 'quote';
      switchToTab('tab-dispatch');
    });
  }

  recompute();
}

/* --------------------------------------------------------------------------
   5. PREDICTIVE IOT FLEET TELEMETRY & FFT CANVAS WAVEFORM
   -------------------------------------------------------------------------- */
function initTelemetrySimulator() {
  const canvas = document.getElementById('waveformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let deltaT = 19.2;
  let suction = 128;
  let staticPres = 0.42;
  let amps = 9.4;
  let currentFault = 'normal';
  let waveSpeed = 0.05;
  let waveAmp = 22;
  let phase = 0;

  const deltaTDigital = document.getElementById('deltaTDigital');
  const deltaTBar = document.getElementById('deltaTBar');
  const deltaTStatus = document.getElementById('deltaTStatus');

  const suctionPsi = document.getElementById('suctionPsi');
  const suctionBar = document.getElementById('suctionBar');
  const suctionStatus = document.getElementById('suctionStatus');

  const staticPressure = document.getElementById('staticPressure');
  const staticBar = document.getElementById('staticBar');
  const staticStatus = document.getElementById('staticStatus');

  const compressorAmps = document.getElementById('compressorAmps');
  const ampsBar = document.getElementById('ampsBar');
  const ampsStatus = document.getElementById('ampsStatus');
  const incidentFeed = document.getElementById('incidentFeed');
  const currentHz = document.getElementById('currentHz');

  const simBtns = document.querySelectorAll('.btn-sim');
  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const id = btn.id;
      if (id === 'simHealthy') {
        currentFault = 'normal';
        waveAmp = 22;
        waveSpeed = 0.05;
        if (currentHz) {
          currentHz.textContent = '60.0 Hz Stable';
          currentHz.className = 'freq-hz text-cyan';
        }
        appendLog('Normal system baseline restored. Inverter compressor running at 42 RPS.', 'log-success');
      } else if (id === 'simDirtyFilter') {
        currentFault = 'dirty_filter';
        waveAmp = 28;
        if (currentHz) currentHz.textContent = '60.4 Hz Variable';
        appendLog('ALERT: Return static pressure spiked to 0.86 in. w.g. Blower motor ramped up +18% to maintain CFM.', 'log-alert');
      } else if (id === 'simRefrigerantLeak') {
        currentFault = 'leak';
        waveAmp = 12;
        if (currentHz) currentHz.textContent = '58.8 Hz Fluctuation';
        appendLog('CRITICAL: Suction saturation pressure dropped below 65 PSI. Coil freezing prevention trip armed.', 'log-alert');
      } else if (id === 'simCompressorSpike') {
        currentFault = 'compressor_spike';
        waveAmp = 42;
        waveSpeed = 0.12;
        if (currentHz) currentHz.textContent = '67.2 Hz Harmonic Distortion';
        appendLog('EMERGENCY: Locked rotor current surge detected (17.8A). Autonomous breaker trip safeguard activated.', 'log-alert');
      }
    });
  });

  function appendLog(msg, typeClass) {
    if (!incidentFeed) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const item = document.createElement('div');
    item.className = `log-entry ${typeClass}`;
    item.innerHTML = `<span class="log-time">${timeStr}</span><span class="log-msg">${msg}</span>`;
    incidentFeed.insertBefore(item, incidentFeed.firstChild);
  }

  setInterval(() => {
    const jitter = (Math.random() - 0.5) * 0.4;

    if (currentFault === 'normal') {
      deltaT = 19.2 + jitter;
      suction = 128 + jitter * 2;
      staticPres = 0.42 + jitter * 0.02;
      amps = 9.4 + jitter;

      updateStatus(deltaTStatus, 'NORMAL', 'badge-tag-good');
      updateStatus(suctionStatus, 'OPTIMAL', 'badge-tag-good');
      updateStatus(staticStatus, 'CLEAN', 'badge-tag-good');
      updateStatus(ampsStatus, 'NOMINAL', 'badge-tag-good');
      if (deltaTBar) deltaTBar.style.backgroundColor = 'var(--cyan-primary)';
      if (suctionBar) suctionBar.style.backgroundColor = 'var(--cyan-primary)';
      if (staticBar) staticBar.style.backgroundColor = 'var(--cyan-primary)';
      if (ampsBar) ampsBar.style.backgroundColor = 'var(--cyan-primary)';
    } else if (currentFault === 'dirty_filter') {
      deltaT = 13.4 + jitter;
      suction = 108 + jitter;
      staticPres = 0.88 + jitter * 0.04;
      amps = 11.2 + jitter;

      updateStatus(deltaTStatus, 'LOW DELTA', 'badge-tag-warn');
      updateStatus(staticStatus, 'CLOGGED (0.88")', 'badge-tag-crit');
      if (staticBar) staticBar.style.backgroundColor = 'var(--amber-primary)';
    } else if (currentFault === 'leak') {
      deltaT = 6.8 + jitter;
      suction = 58 + jitter;
      staticPres = 0.44 + jitter * 0.02;
      amps = 6.2 + jitter;

      updateStatus(deltaTStatus, 'POOR (6.8°F)', 'badge-tag-crit');
      updateStatus(suctionStatus, 'LOW PSI (58)', 'badge-tag-crit');
      if (suctionBar) suctionBar.style.backgroundColor = 'var(--amber-primary)';
      if (deltaTBar) deltaTBar.style.backgroundColor = 'var(--amber-primary)';
    } else if (currentFault === 'compressor_spike') {
      deltaT = 3.1 + jitter;
      suction = 82 + jitter;
      staticPres = 0.45 + jitter * 0.02;
      amps = 17.6 + jitter;

      updateStatus(ampsStatus, 'OVERLOAD (17.6A)', 'badge-tag-crit');
      if (ampsBar) ampsBar.style.backgroundColor = '#ef4444';
    }

    if (deltaTDigital) deltaTDigital.textContent = `${deltaT.toFixed(1)}°F`;
    if (suctionPsi) suctionPsi.textContent = `${Math.round(suction)} PSI`;
    if (staticPressure) staticPressure.textContent = `${staticPres.toFixed(2)} in. w.g.`;
    if (compressorAmps) compressorAmps.textContent = `${amps.toFixed(1)} A`;

    if (deltaTBar) deltaTBar.style.width = `${Math.min(100, Math.max(10, (deltaT / 25) * 100))}%`;
    if (suctionBar) suctionBar.style.width = `${Math.min(100, Math.max(10, (suction / 160) * 100))}%`;
    if (staticBar) staticBar.style.width = `${Math.min(100, Math.max(10, (staticPres / 1.0) * 100))}%`;
    if (ampsBar) ampsBar.style.width = `${Math.min(100, Math.max(10, (amps / 20) * 100))}%`;
  }, 1000);

  function updateStatus(el, text, className) {
    if (!el) return;
    el.textContent = text;
    el.className = className;
  }

  function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = currentFault === 'normal' ? '#00d2ff' : (currentFault === 'compressor_spike' ? '#ef4444' : '#ff6b35');
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = ctx.strokeStyle;

    ctx.beginPath();
    const centerY = canvas.height / 2;

    for (let x = 0; x < canvas.width; x++) {
      const y = centerY + Math.sin(x * 0.025 + phase) * waveAmp + Math.sin(x * 0.05 + phase * 1.5) * (waveAmp * 0.35);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    phase += waveSpeed;
    requestAnimationFrame(drawWave);
  }

  function resizeCanvas() {
    if (canvas && canvas.parentElement) {
      canvas.width = Math.max(280, canvas.parentElement.clientWidth - 28);
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  drawWave();
}

/* --------------------------------------------------------------------------
   6. 24/7 AUTONOMOUS DISPATCH BOOKING ENGINE
   -------------------------------------------------------------------------- */
function initDispatchEngine() {
  const form = document.getElementById('dispatchForm');
  const timeSlots = document.querySelectorAll('.time-slot');
  const modal = document.getElementById('bookingModal');
  const modalBody = document.getElementById('modalBookingDetails');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalDismiss = document.getElementById('modalDismissBtn');
  const modalTrack = document.getElementById('modalTrackBtn');

  let selectedSlot = 'asap';

  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      selectedSlot = slot.getAttribute('data-slot');
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const urgency = document.getElementById('dispatchUrgency').value;
      const notes = document.getElementById('techNotes').value.trim();

      if (!name || !phone || !address) {
        alert('Please fill out Name, Phone, and Service Address.');
        return;
      }

      const ticketId = 'AT-' + Math.floor(100000 + Math.random() * 900000);
      const estEta = selectedSlot === 'asap' ? '18 - 30 Minutes' : 'Scheduled Window';

      modalBody.innerHTML = `
        <p>Your request has been verified by the AeroTherma AI Dispatch Gateway. Unit #42 (Lead Tech Marcus Vance) has been queued with your route coordinates.</p>
        <div class="dispatch-ticket-card">
          <div class="ticket-row">
            <span>Ticket Number:</span>
            <strong class="text-cyan">${ticketId}</strong>
          </div>
          <div class="ticket-row">
            <span>Customer:</span>
            <strong class="text-white">${name}</strong>
          </div>
          <div class="ticket-row">
            <span>Contact Phone:</span>
            <strong class="text-white">${phone}</strong>
          </div>
          <div class="ticket-row">
            <span>Service Address:</span>
            <strong class="text-white">${address}</strong>
          </div>
          <div class="ticket-row">
            <span>Arrival Estimate:</span>
            <strong class="text-emerald">${estEta}</strong>
          </div>
          <div class="ticket-row">
            <span>Urgency Tier:</span>
            <strong class="text-amber">${urgency.toUpperCase()}</strong>
          </div>
          ${notes ? `<div class="ticket-row"><span>Diagnostic Brief:</span><small class="text-secondary">${notes}</small></div>` : ''}
        </div>
        <p style="margin-top: 14px; font-size: 0.8rem; color: var(--text-muted);">
          A live SMS tracking link has been sent to <strong>${phone}</strong> with vehicle telemetry and technician credentials.
        </p>
      `;

      modal.style.display = 'flex';
    });
  }

  function closeModal() {
    if (modal) modal.style.display = 'none';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalDismiss) modalDismiss.addEventListener('click', closeModal);
  if (modalTrack) modalTrack.addEventListener('click', () => {
    closeModal();
    const tracker = document.getElementById('techTrackerPanel');
    if (tracker) tracker.scrollIntoView({ behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   7. SERVICE AREA QUICK ZIP CHECKER
   -------------------------------------------------------------------------- */
function initServiceAreaZipChecker() {
  const btn = document.getElementById('quickZipBtn');
  const input = document.getElementById('quickZipInput');
  const output = document.getElementById('quickZipFeedback');

  if (!btn || !input || !output) return;

  btn.addEventListener('click', () => {
    const zip = input.value.trim();
    if (!zip || zip.length < 5) {
      output.textContent = 'Please enter a valid 5-digit zip code.';
      output.style.color = '#f87171';
      return;
    }

    output.textContent = `Scanning active dispatch units in zip ${zip}...`;
    output.style.color = 'var(--cyan-primary)';

    setTimeout(() => {
      output.innerHTML = `
        <span class="text-emerald">✓ Great news!</span> Active mobile technician detected within <strong>4.2 miles</strong> of ${zip}. Estimated arrival time: <strong class="text-white">18-24 minutes</strong>. <a href="#ai-dispatch" style="color: var(--cyan-primary); text-decoration: underline; margin-left: 8px;">Claim this dispatch window →</a>
      `;
    }, 500);
  });
}

/* --------------------------------------------------------------------------
   8. BLOG FAQ QUICK LAUNCH
   -------------------------------------------------------------------------- */
function initBlogFaqInteractions() {
  const readBtns = document.querySelectorAll('.blog-read-btn');
  readBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const faq = btn.getAttribute('data-faq');
      let prompt = "Why is my AC blowing warm air, what causes this?";
      if (faq === 'furnace_click') prompt = "How do I reset my furnace after it clicks and shuts off?";
      if (faq === 'heat_pump_guide') prompt = "How much does a 3 ton heat pump cost after rebates?";

      const chatTrigger = document.getElementById('widgetTrigger');
      const chatInput = document.getElementById('chatInput');
      const chatForm = document.getElementById('chatForm');

      if (chatTrigger) chatTrigger.click();
      if (chatInput && chatForm) {
        chatInput.value = prompt;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. CUSTOMER PORTAL / PAY BILL MODAL
   -------------------------------------------------------------------------- */
function initCustomerPortal() {
  const openBtn = document.getElementById('openPortalBtn');
  const modal = document.getElementById('portalModal');
  const closeBtn = document.getElementById('portalCloseBtn');
  const dismissBtn = document.getElementById('portalDismissBtn');
  const loginBtn = document.getElementById('portalLoginBtn');

  function openPortal() {
    if (modal) modal.style.display = 'flex';
  }
  function closePortal() {
    if (modal) modal.style.display = 'none';
  }

  if (openBtn) openBtn.addEventListener('click', openPortal);
  if (closeBtn) closeBtn.addEventListener('click', closePortal);
  if (dismissBtn) dismissBtn.addEventListener('click', closePortal);

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginBtn.innerHTML = `<span>Connecting to ServiceTitan / Housecall Pro...</span>`;
      setTimeout(() => {
        alert('Welcome! Your ServiceTitan / Housecall Pro integration session has been authenticated. Redirecting to invoice portal...');
        closePortal();
        loginBtn.innerHTML = `<span>Login with ServiceTitan / Housecall Pro</span>`;
      }, 900);
    });
  }

  // Careers Quick Apply
  const applyBtn = document.getElementById('applyCareersBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      const msgBox = document.getElementById('contactMsg');
      if (msgBox) {
        msgBox.value = 'I am interested in applying for the HVAC Lead Technician / Installer position. My experience includes...';
      }
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   10. UNIVERSAL CONTACT & LEAD FORM HANDLERS
   -------------------------------------------------------------------------- */
function initContactForm() {
  const formConfigs = [
    { id: 'contactForm', nameId: 'contactName', phoneId: 'contactPhone', feedbackId: 'contactFormFeedback' },
    { id: 'contactQuoteForm', nameId: 'quoteName', phoneId: 'quotePhone', feedbackId: 'quoteFeedback' },
    { id: 'contactPageForm', nameId: 'cpName', phoneId: 'cpPhone', feedbackId: 'cpFeedback' },
    { id: 'acLeadForm', nameId: 'acName', phoneId: 'acPhone', feedbackId: 'acFeedback' },
    { id: 'heatingLeadForm', nameId: 'heatingName', phoneId: 'heatingPhone', feedbackId: 'heatingFeedback' },
    { id: 'tuneupForm', nameId: 'tuName', phoneId: 'tuPhone', feedbackId: 'tuFeedback' },
    { id: 'emergencyLeadForm', nameId: 'emName', phoneId: 'emPhone', feedbackId: 'emFeedback' },
    { id: 'iaqLeadForm', nameId: 'iaqName', phoneId: 'iaqPhone', feedbackId: 'iaqFeedback' },
    { id: 'ductsLeadForm', nameId: 'ductsName', phoneId: 'ductsPhone', feedbackId: 'ductsFeedback' },
    { id: 'seattleLeadForm', nameId: 'seaName', phoneId: 'seaPhone', feedbackId: 'seaFeedback' },
    { id: 'bellevueLeadForm', nameId: 'belName', phoneId: 'belPhone', feedbackId: 'belFeedback' },
    { id: 'tacomaLeadForm', nameId: 'tacomaName', phoneId: 'tacomaPhone', feedbackId: 'tacomaFeedback' }
  ];

  formConfigs.forEach(cfg => {
    const form = document.getElementById(cfg.id);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById(cfg.nameId);
      const phoneEl = document.getElementById(cfg.phoneId);
      const feedbackEl = document.getElementById(cfg.feedbackId);

      const name = nameEl ? nameEl.value.trim() : 'Valued Homeowner';
      const phone = phoneEl ? phoneEl.value.trim() : 'your number';

      if (!name || !phone) return;

      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.backgroundColor = '#ecfdf5';
        feedbackEl.style.color = '#065f46';
        feedbackEl.style.border = '1px solid #a7f3d0';
        feedbackEl.style.borderRadius = '8px';
        feedbackEl.style.padding = '16px';
        feedbackEl.style.marginTop = '16px';
        feedbackEl.style.fontWeight = '500';
        feedbackEl.style.lineHeight = '1.5';
        feedbackEl.innerHTML = `✓ <strong>Thank you, ${escapeHtml(name)}!</strong> Your request has been received. Our local dispatch manager will call you at <strong>${escapeHtml(phone)}</strong> within 15 minutes to confirm your appointment details.`;
      }

      form.reset();
    });
  });
}

/* --------------------------------------------------------------------------
   11. 24/7 AI FLOATING CHATBOT ASSISTANT
   -------------------------------------------------------------------------- */
function initFloatingAiChat() {
  const trigger = document.getElementById('widgetTrigger');
  const windowEl = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('closeChatBtn');
  const quickOpenBtn = document.getElementById('openChatQuick');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  function openChat() {
    windowEl.style.display = 'flex';
    trigger.style.display = 'none';
    chatInput.focus();
  }

  function closeChat() {
    windowEl.style.display = 'none';
    trigger.style.display = 'flex';
  }

  if (trigger) trigger.addEventListener('click', openChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);
  if (quickOpenBtn) quickOpenBtn.addEventListener('click', openChat);

  // Quick prompt chips
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-chip')) {
      const query = e.target.getAttribute('data-query');
      if (query) {
        addUserMessage(query);
        respondToQuery(query);
      }
    }
  });

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      addUserMessage(text);
      respondToQuery(text);
    });
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg msg-user';
    msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function respondToQuery(query) {
    const typing = document.createElement('div');
    typing.className = 'chat-msg msg-ai';
    typing.innerHTML = `<div class="msg-bubble text-secondary">AeroBot is checking service schedule & tech availability...</div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const response = generateHvacResponse(query.toLowerCase());
      const msg = document.createElement('div');
      msg.className = 'chat-msg msg-ai';
      msg.innerHTML = `<div class="msg-bubble">${response}</div>`;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 700);
  }

  function generateHvacResponse(q) {
    if (q.includes('warm air') || q.includes('not cooling') || q.includes('air conditioning')) {
      return `When an AC blows warm air, 82% of field diagnostics identify either:
      1. <strong>Failed Dual-Run Capacitor</strong> (compressor cannot start, outdoor fan may or may not spin).
      2. <strong>Low Refrigerant / Coil Leak</strong> (causing low suction pressure and frozen lines).
      3. <strong>Tripped Condensate Float Switch</strong> (cuts 24V power to prevent ceiling water damage).
      <br><br>🚨 <em>Emergency action: Turn the system OFF at the thermostat right now to prevent burning out the compressor motor. We have on-call techs rolling across the metro area!</em>`;
    }
    if (q.includes('tune-up') || q.includes('tuneup') || q.includes('89')) {
      return `Our <strong>$89 Precision Tune-Up Special</strong> includes:
      • 34-Point safety & efficiency inspection
      • Capacitor microfarad testing & contactor burn check
      • Airflow CFM & temperature split (Delta-T) verification
      • Condensate drain chemical tablet flush
      <br><br>Would you like to book for today or tomorrow morning?`;
    }
    if (q.includes('service area') || q.includes('city') || q.includes('puget sound') || q.includes('seattle')) {
      return `Yes! We provide 24/7 service throughout <strong>Seattle, Bellevue, Kirkland, Redmond, Renton, Kent, Tacoma, Lynnwood, and Everett</strong>.
      Our average arrival time is currently <strong>18-25 minutes</strong>.`;
    }
    if (q.includes('cost') || q.includes('price') || q.includes('heat pump')) {
      return `A premium inverter cold-climate heat pump (such as Daikin Fit or Mitsubishi Hyper-Heating) typically ranges from <strong>$8,500 to $13,500 installed</strong>.
      <br><br>🎉 <strong>Current Discounts & Rebates:</strong>
      • $500 Instant Online Coupon (Code: <strong>HEATPUMP500</strong>)
      • $2,000 Federal IRA Section 25C Tax Credit
      • Up to $4,000 Local Electric Utility Rebates!
      <br>Net cost often drops to <strong>$6,500 - $8,200</strong> with 0% APR financing options!`;
    }
    if (q.includes('furnace') || q.includes('reset') || q.includes('ignite') || q.includes('click')) {
      return `If your gas furnace clicks 3 times and shuts off:
      1. Turn power switch on side of furnace OFF for 60 seconds, then back ON.
      2. Watch the small glass sight glass for blinking error LEDs (e.g. 3 red flashes = pressure switch or dirty flame rod).
      3. If you smell gas at any time, do not reset—evacuate and call our emergency line <strong>(800) 555-HVAC</strong> immediately.`;
    }
    return `Thank you for reaching out! I've noted: <em>"${escapeHtml(q)}"</em>. For immediate assistance, our 24/7 live dispatch team can be reached directly at <strong>(800) 555-HVAC</strong>, or you can click <strong>Schedule Service</strong> above for instant online booking!`;
  }
}

/* --------------------------------------------------------------------------
   12. MOBILE NAVIGATION TOGGLE
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');
  const dropdownToggle = document.getElementById('servicesDropdownBtn');
  const dropdownMenu = document.getElementById('servicesMenu');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });

    nav.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('show');
      });
    });
  }

  // Mobile dropdown toggle
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1100) {
        e.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
      }
    });

    dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1100) {
          dropdownMenu.style.display = 'none';
          if (nav) nav.classList.remove('show');
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   13. HERO STATS ANIMATED COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    if (animated) return;
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      let current = 0;
      const step = target / 40;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = target % 1 === 0 ? Math.round(current) : current.toFixed(1);
      }, 30);
    });
    animated = true;
  }

  runCounters();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
