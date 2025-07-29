// Dummy data for molecule rankings
const moleculeRankings = [
    { molecule: 'Mol-101', protein: 'PfEMP1', binding: -7.2, stability: 'High' },
    { molecule: 'Mol-102', protein: 'PfEMP1', binding: -6.8, stability: 'Medium' },
    { molecule: 'Mol-103', protein: 'PfEMP1', binding: -6.5, stability: 'Low' },
    { molecule: 'Mol-104', protein: 'PfEMP1', binding: -5.9, stability: 'Medium' },
    { molecule: 'Mol-105', protein: 'PfEMP1', binding: -5.2, stability: 'High' }
];

// Process sequence steps
const processSteps = [
    { id: 'final-molecule', title: 'Structural Analysis', description: 'Examining the structure of the protein complex', icon: 'fa-solid fa-star' },
    { id: 'target-regions', title: 'Target Regions', description: 'Identifying active binding sites and pockets', icon: 'fa-solid fa-crosshairs' },
    { id: 'binding-sites', title: 'Pocket Analysis', description: 'Analyzing protein-ligand interaction patterns', icon: 'fa-solid fa-link' },
    { id: 'quantum-optimisation', title: 'VQE Optimization', description: 'Ground State Energy estimation', icon: 'fa-solid fa-atom' },
    { id: 'final-molecule', title: 'Top Ligands Selection', description: 'Selecting optimal ligand candidates', icon: 'fa-solid fa-star' }
];

// Populate molecule rankings table
document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('molecule-table-body');
    if (tbody) {
        moleculeRankings.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.molecule}</td>
                <td>${row.protein}</td>
                <td>${row.binding}</td>
                <td>${row.stability}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Render charts
    renderBindingEnergyChart();
    renderEnergyDecompositionChart();

    // Only render carousel if uploads tab is active
    if (document.querySelector('.uploads-molecule-carousel')) {
        renderUploadsMoleculeCarousel();
    }

    // Setup file upload handling
    setupFileUpload();
    
    // Setup process sequence
    setupProcessSequence();

    // Start the process sequence automatically after PDB upload
    const uploadForm = document.getElementById('dashboard-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = this.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            
            if (file && file.name.toLowerCase().endsWith('.pdb')) {
                // Show upload success message
                showUploadSuccess(file.name);
                
                // Automatically switch to process tab after a short delay
                setTimeout(() => {
                    showTab('process');
                    startProcessSequence();
                }, 1500);
            } else {
                alert('Please select a valid PDB file.');
            }
        });
    }
});

// File upload handling
function setupFileUpload() {
    const uploadForm = document.getElementById('dashboard-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = this.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            
            if (file && file.name.toLowerCase().endsWith('.pdb')) {
                // Show upload success message
                showUploadSuccess(file.name);
                
                // Automatically switch to process tab after a short delay
                setTimeout(() => {
                    showTab('process');
                    startProcessSequence();
                }, 1500);
            } else {
                alert('Please select a valid PDB file.');
            }
        });
    }
}

// Show upload success message
function showUploadSuccess(filename) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'upload-success-notification';
    notification.innerHTML = `
        <i class="fa-solid fa-check-circle"></i>
        <span>Successfully uploaded ${filename}</span>
        <span class="processing-text">Processing molecule discovery sequence...</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup process sequence
function setupProcessSequence() {
    const processContent = document.querySelector('.process-content');
    if (processContent) {
        // Check if process sequence already exists
        let sequenceContainer = processContent.querySelector('.process-sequence');
        
        if (!sequenceContainer) {
            // Create process sequence container
            sequenceContainer = document.createElement('div');
            sequenceContainer.className = 'process-sequence';
            sequenceContainer.innerHTML = `
                <div class="process-sequence-title">Molecule Discovery Sequence</div>
                <div class="process-steps">
                    ${processSteps.map((step, index) => `
                        <div class="process-step" data-step="${step.id}">
                            <div class="process-step-number">${index + 1}</div>
                            <div class="process-step-icon"><i class="${step.icon}"></i></div>
                            <div class="process-step-content">
                                <div class="process-step-title">${step.title}</div>
                                <div class="process-step-description">${step.description}</div>
                            </div>
                            <div class="process-step-status">
                                <i class="fa-solid fa-clock"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="process-progress">
                    <div class="process-progress-bar">
                        <div class="process-progress-fill"></div>
                    </div>
                    <div class="process-progress-text">0% Complete</div>
                </div>
            `;
            
            // Insert before the existing process dashboard
            const existingDashboard = processContent.querySelector('.process-dashboard');
            processContent.insertBefore(sequenceContainer, existingDashboard);
        }
    }
}

// Start the process sequence
function startProcessSequence() {
    const steps = document.querySelectorAll('.process-step');
    const progressFill = document.querySelector('.process-progress-fill');
    const progressText = document.querySelector('.process-progress-text');
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    function executeStep() {
        if (currentStep >= totalSteps) {
            // Sequence complete
            setTimeout(() => {
                showFinalResults();
            }, 1000);
            return;
        }
        
        const step = steps[currentStep];
        const stepId = step.getAttribute('data-step');
        
        // Animate step activation
        step.style.transform = 'scale(1.02)';
        step.style.transition = 'all 0.3s ease';
        
        // Update step status with animation
        step.classList.add('active');
        const statusIcon = step.querySelector('.process-step-status');
        statusIcon.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        statusIcon.style.animation = 'pulse 1s infinite';
        
        // Update progress with smooth animation
        const progress = ((currentStep + 1) / totalSteps) * 100;
        progressFill.style.transition = 'width 0.8s ease-in-out';
        progressFill.style.width = progress + '%';
        
        // Animate progress text
        progressText.style.transition = 'all 0.3s ease';
        progressText.style.transform = 'scale(1.1)';
        progressText.style.color = '#6ed6ff';
        
        // Update percentage text with counting animation
        animatePercentage(progressText, Math.round(progress));
        
        // Simulate processing time with visual feedback
        setTimeout(() => {
            // Complete the step
            step.classList.remove('active');
            step.classList.add('completed');
            
            // Animate completion
            step.style.transform = 'scale(1)';
            statusIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
            statusIcon.style.animation = 'none';
            statusIcon.style.color = '#00d4aa';
            
            // Add completion glow effect
            step.style.boxShadow = '0 0 20px rgba(0, 212, 170, 0.4)';
            
            // Show step-specific content
            showStepContent(stepId);
            
            // Reset progress text animation
            setTimeout(() => {
                progressText.style.transform = 'scale(1)';
                progressText.style.color = '#ffffff';
            }, 300);
            
            currentStep++;
            setTimeout(executeStep, 1000);
        }, 2500);
    }
    
    // Start the sequence with initial animation
    setTimeout(() => {
        // Add initial pulse to first step
        steps[0].style.animation = 'pulse 2s infinite';
        executeStep();
    }, 500);
}

// Animate percentage counting
function animatePercentage(element, targetPercentage) {
    let currentPercentage = 0;
    const increment = targetPercentage / 20; // 20 steps for smooth animation
    
    const timer = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentPercentage) + '% Complete';
    }, 40);
}

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .process-step.active {
        animation: pulse 1s infinite;
    }
    
    .process-step.completed {
        animation: none;
    }
`;
document.head.appendChild(style);

// Show step-specific content
function showStepContent(stepId) {
    const processDashboard = document.querySelector('.process-dashboard');
    
    switch(stepId) {
        case 'target-regions':
            updateProcessDashboard('Target Regions', 'Identifying active binding sites in PfEMP1 protein', 'fa-solid fa-crosshairs');
            break;
        case 'binding-sites':
            updateProcessDashboard('Binding Sites', 'Analyzing protein-ligand interaction patterns', 'fa-solid fa-link');
            break;
        case 'quantum-annealing':
            updateProcessDashboard('Quantum Annealing', 'Ligand optimization using quantum annealing', 'fa-solid fa-atom');
            break;
        case 'qaoa-balance':
            updateProcessDashboard('QAOA Optimization', 'Balance toxicity using Quantum Approximate Optimization Algorithm', 'fa-solid fa-balance-scale');
            break;
        case 'quantum-kernel':
            updateProcessDashboard('Quantum Kernel Methods', 'Classifying drug likeness with quantum kernel methods', 'fa-solid fa-brain');
            break;
        case 'final-molecule':
            updateProcessDashboard('Final Selection', 'Selecting optimal drug candidate', 'fa-solid fa-star');
            break;
    }
}

// Update process dashboard content
function updateProcessDashboard(title, description, icon) {
    const processDashboard = document.querySelector('.process-dashboard');
    if (processDashboard) {
        const titleElement = processDashboard.querySelector('.process-card-title');
        if (titleElement) {
            titleElement.innerHTML = title;
        }
        
        // Add description if it doesn't exist
        let descElement = processDashboard.querySelector('.process-card-description');
        if (!descElement) {
            descElement = document.createElement('div');
            descElement.className = 'process-card-description';
            processDashboard.querySelector('.process-card').appendChild(descElement);
        }
        descElement.textContent = description;
    }
}

// Show final results
function showFinalResults() {
    const processDashboard = document.querySelector('.process-dashboard');
    if (processDashboard) {
        processDashboard.innerHTML = `
            <div class="process-col process-rankings">
                <div class="process-card process-rankings-card">
                    <div class="process-card-title">Top 5 Ligands</div>
                    <div class="ligand-results">
                        <div class="ligand-item">
                            <div class="ligand-structure">O=C(O)CCc1cccc(CO)c1</div>
                            <div class="ligand-metrics">
                                <span class="qed-score">QED: 0.73</span>
                                <span class="mw-score">MW: 180.20</span>
                            </div>
                        </div>
                        <div class="ligand-item">
                            <div class="ligand-structure">COc1ccc2c(O)cccc2c1</div>
                            <div class="ligand-metrics">
                                <span class="qed-score">QED: 0.72</span>
                                <span class="mw-score">MW: 174.20</span>
                            </div>
                        </div>
                        <div class="ligand-item">
                            <div class="ligand-structure">COC1CCc2c(O)cccc2C1</div>
                            <div class="ligand-metrics">
                                <span class="qed-score">QED: 0.71</span>
                                <span class="mw-score">MW: 178.23</span>
                            </div>
                        </div>
                        <div class="ligand-item">
                            <div class="ligand-structure">O=C(O)COc1ccccc1</div>
                            <div class="ligand-metrics">
                                <span class="qed-score">QED: 0.71</span>
                                <span class="mw-score">MW: 152.15</span>
                            </div>
                        </div>
                        <div class="ligand-item">
                            <div class="ligand-structure">O=C(O)c1cccc(C(=O)O)c1</div>
                            <div class="ligand-metrics">
                                <span class="qed-score">QED: 0.69</span>
                                <span class="mw-score">MW: 166.13</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="process-col process-input">
                <div class="process-card process-input-card">
                    <div class="process-card-title">Pocket Analysis</div>
                    <div class="pocket-summary">
                        <div class="pocket-item">
                            <i class="fa-solid fa-crosshairs"></i>
                            <span>Found 4 pockets</span>
                        </div>
                        <div class="pocket-item">
                            <i class="fa-solid fa-circle"></i>
                            <span>Pocket 1: pocket1_atm.pdb</span>
                        </div>
                        <div class="pocket-item">
                            <i class="fa-solid fa-circle"></i>
                            <span>Pocket 2: pocket3_atm.pdb</span>
                        </div>
                        <div class="pocket-item">
                            <i class="fa-solid fa-circle"></i>
                            <span>Pocket 3: pocket4_atm.pdb</span>
                        </div>
                        <div class="pocket-item">
                            <i class="fa-solid fa-circle"></i>
                            <span>Pocket 4: pocket2_atm.pdb</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="process-col process-vqe">
                <div class="process-card process-vqe-card">
                    <div class="process-card-title">Quantum Results</div>
                    <div class="quantum-results">
                        <div class="quantum-result-item">
                            <span>Quantum Annealing</span>
                            <span class="quantum-value">Converged</span>
                        </div>
                        <div class="quantum-result-item">
                            <span>QAOA Algorithm</span>
                            <span class="quantum-value">Optimized</span>
                        </div>
                        <div class="quantum-result-item">
                            <span>Quantum Kernel</span>
                            <span class="quantum-value">Classified</span>
                        </div>
                        <div class="quantum-result-item">
                            <span>Confidence Level</span>
                            <span class="quantum-value">95%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="process-col process-results">
                <div class="process-card process-results-card">
                    <div class="process-card-title">Success!</div>
                    <div class="success-message">
                        <i class="fa-solid fa-check-circle fa-3x"></i>
                        <div class="success-title">Qualaria Complete</div>
                        <div class="success-description">Top 5 ligands identified for malaria treatment</div>
                        <button class="process-calc-btn">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Chart: Binding Energy Distribution
function renderBindingEnergyChart() {
    const ctx = document.getElementById('bindingEnergyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mol-101', 'Mol-102', 'Mol-103', 'Mol-104', 'Mol-105'],
            datasets: [{
                label: 'molecule',
                data: [10, 6, 4, 2, 1],
                backgroundColor: '#6ed6ff',
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.7
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: '#22336a' },
                    ticks: { color: '#b3c7e6', font: { size: 12 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#b3c7e6', font: { size: 12 } }
                }
            }
        }
    });
}

// Chart: Energy Decomposition
function renderEnergyDecompositionChart() {
    const ctx = document.getElementById('energyDecompositionChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
            datasets: [{
                label: 'Binding Energy',
                data: [20, 30, 25, 35, 38],
                borderColor: '#6ed6ff',
                backgroundColor: 'rgba(110,214,255,0.15)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6ed6ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#b3c7e6', font: { size: 13 } }
                }
            },
            scales: {
                x: {
                    grid: { color: '#22336a' },
                    ticks: { color: '#b3c7e6', font: { size: 12 } }
                },
                y: {
                    grid: { color: '#22336a' },
                    ticks: { color: '#b3c7e6', font: { size: 12 } }
                }
            }
        }
    });
}

// Dummy data for uploads molecule carousel
const uploadsMolecules = [
    { id: 101, name: 'Molecule 101', icon: 'fa-solid fa-atom' },
    { id: 102, name: 'Molecule 102', icon: 'fa-solid fa-atom' },
    { id: 103, name: 'Molecule 103', icon: 'fa-solid fa-atom' },
    { id: 104, name: 'Molecule 104', icon: 'fa-solid fa-atom' },
    { id: 105, name: 'Molecule 105', icon: 'fa-solid fa-atom' }
];

function renderUploadsMoleculeCarousel() {
    const carousel = document.querySelector('.uploads-molecule-carousel');
    if (!carousel) return;
    carousel.innerHTML = '';
    uploadsMolecules.forEach((mol, idx) => {
        const card = document.createElement('div');
        card.className = 'uploads-molecule-card' + (idx === 1 ? ' active' : '');
        card.innerHTML = `
            <div class="molecule-icon"><i class="${mol.icon}"></i></div>
            <div class="molecule-title">${mol.name}</div>
            <button class="uploads-more-info-btn">More Info <i class="fa-solid fa-arrow-right"></i></button>
            <div class="uploads-arrow"><i class="fa-solid fa-arrow-right"></i></div>
        `;
        carousel.appendChild(card);
    });
}

function showTab(tab) {
    // Hide all tab contents
    document.querySelectorAll('[data-tab-content]').forEach(section => {
        section.style.display = 'none';
    });
    // Remove active from all sidebar tabs
    document.querySelectorAll('.sidebar-tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });
    // Show the selected tab content
    const section = document.querySelector(`[data-tab-content="${tab}"]`);
    if (section) section.style.display = '';
    // Set active on sidebar
    const sidebarTab = document.querySelector(`.sidebar-tab[data-tab="${tab}"]`);
    if (sidebarTab) sidebarTab.classList.add('active');
    // Render charts/carousel as needed
    if (tab === 'dashboard') {
        renderBindingEnergyChart();
        renderEnergyDecompositionChart();
    } else if (tab === 'uploads') {
        renderUploadsMoleculeCarousel();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Only render carousel if uploads tab is active
    if (document.querySelector('.uploads-molecule-carousel')) {
        renderUploadsMoleculeCarousel();
    }
    // Tab switching
    document.querySelectorAll('.sidebar-tab').forEach(tabEl => {
        tabEl.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            showTab(tab);
        });
    });
    // Show dashboard tab by default
    showTab('dashboard');
}); 