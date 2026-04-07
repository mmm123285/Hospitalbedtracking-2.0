
        // Sample hospital data (in real app, this would come from API/WebSocket)
        const hospitalsData = [
            {
                id: 1,
                name: "City General Hospital",
                location: "Downtown, 123 Main St",
                totalBeds: 250,
                beds: [
                    {id: 1, status: 'available'},
                    {id: 2, status: 'occupied'},
                    {id: 3, status: 'available'},
                    {id: 4, status: 'occupied'},
                    {id: 5, status: 'critical'},
                    // ... more beds
                ]
            },
            {
                id: 2,
                name: "Memorial Medical Center",
                location: "Uptown, 456 Oak Ave",
                totalBeds: 180,
                beds: [
                    {id: 1, status: 'available'},
                    {id: 2, status: 'available'},
                    {id: 3, status: 'occupied'},
                    {id: 4, status: 'available'},
                    {id: 5, status: 'available'},
                ]
            },
            {
                id: 3,
                name: "Saint Mary's Hospital",
                location: "Westside, 789 Pine Rd",
                totalBeds: 320,
                beds: [
                    {id: 1, status: 'occupied'},
                    {id: 2, status: 'critical'},
                    {id: 3, status: 'occupied'},
                    {id: 4, status: 'critical'},
                    {id: 5, status: 'occupied'},
                ]
            },
            {
                id: 4,
                name: "Central Health",
                location: "Eastside, 101 Elm St",
                totalBeds: 150,
                beds: [
                    {id: 1, status: 'available'},
                    {id: 2, status: 'available'},
                    {id: 3, status: 'available'},
                    {id: 4, status: 'available'},
                    {id: 5, status: 'available'},
                ]
            },
            {
                id: 5,
                name: "University Hospital",
                location: "Campus Area, 202 College Dr",
                totalBeds: 347,
                beds: [
                    {id: 1, status: 'occupied'},
                    {id: 2, status: 'occupied'},
                    {id: 3, status: 'available'},
                    {id: 4, status: 'critical'},
                    {id: 5, status: 'occupied'},
                ]
            }
        ];

        let currentFilter = 'all';
        let allHospitals = [...hospitalsData];

        // Initialize the app
        function init() {
            renderHospitals(allHospitals);
            updateStats(allHospitals);
            setupFilters();
            startAutoRefresh();
        }

        // Render hospitals grid
        function renderHospitals(hospitals) {
            const grid = document.getElementById('hospitalsGrid');
            grid.innerHTML = hospitals.map(hospital => createHospitalCard(hospital)).join('');
        }

        // Create hospital card HTML
        function createHospitalCard(hospital) {
            const availableCount = hospital.beds.filter(b => b.status === 'available').length;
            const occupiedCount = hospital.beds.filter(b => b.status === 'occupied').length;
            const criticalCount = hospital.beds.filter(b => b.status === 'critical').length;

            const bedElements = hospital.beds.slice(0, 8).map(bed => 
                `<div class="bed-item bed-${bed.status}">
                    Bed ${bed.id}
                </div>`
            ).join('');

            return `
                <div class="hospital-card" data-hospital-id="${hospital.id}">
                    <div class="hospital-header">
                        <div class="hospital-name">${hospital.name}</div>
                        <div class="hospital-location">${hospital.location}</div>
                    </div>
                    <div class="hospital-body">
                        <div class="bed-status">
                            ${bedElements}
                            ${hospital.beds.length > 8 ? `<div class="bed-item bed-available">+${hospital.beds.length - 8}</div>` : ''}
                        </div>
                        <div class="bed-summary">
                            <div class="summary-text">Summary</div>
                            <div class="summary-numbers">
                                <span class="summary-available">${availableCount} Available</span> | 
                                <span class="summary-occupied">${occupiedCount} Occupied</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Update statistics
        function updateStats(hospitals) {
            const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
            const availableBeds = hospitals.reduce((sum, h) => {
                return sum + h.beds.filter(b => b.status === 'available').length;
            }, 0);
            const occupiedBeds = hospitals.reduce((sum, h) => {
                return sum + h.beds.filter(b => b.status === 'occupied').length;
            }, 0);
            const criticalBeds = hospitals.reduce((sum, h) => {
                return sum + h.beds.filter(b => b.status === 'critical').length;
            }, 0);

            document.getElementById('totalBeds').textContent = totalBeds.toLocaleString();
            document.getElementById('availableBeds').textContent = availableBeds.toLocaleString();
            document.getElementById('occupiedBeds').textContent = occupiedBeds.toLocaleString();
            document.getElementById('criticalBeds').textContent = criticalBeds.toLocaleString();
        }

        // Filter hospitals
        function filterHospitals(filter) {
            let filtered = allHospitals;
            
            if (filter === 'available') {
                filtered = allHospitals.filter(h => 
                    h.beds.some(b => b.status === 'available')
                );
            } else if (filter === 'critical') {
                filtered = allHospitals.filter(h => 
                    h.beds.some(b => b.status === 'critical')
                );
            }
            
            renderHospitals(filtered);
            updateStats(filtered);
        }

        // Setup filter buttons
        function setupFilters() {
            document.querySelectorAll('.control-btn[data-filter]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentFilter = e.target.dataset.filter;
                    filterHospitals(currentFilter);
                });
            });
        }

        // Refresh data function
        function refreshData() {
            // Simulate API call with random updates
            allHospitals = allHospitals.map(hospital => {
                const updatedBeds = hospital.beds.map(bed => {
                    if (Math.random() < 0.1) { // 10% chance to change status
                        const statuses = ['available', 'occupied', 'critical'];
                        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        return {...bed, status: newStatus};
                    }
                    return bed;
                });
                return {...hospital, beds: updatedBeds};
            });
            
            filterHospitals(currentFilter);
        }

        // Auto-refresh every 10 seconds
        function startAutoRefresh() {
            setInterval(refreshData, 10000);
        }

        // Initialize app when page loads
        init();
