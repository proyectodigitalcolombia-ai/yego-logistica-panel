<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>YEGO LOGÍSTICA - PANEL UNIFICADO</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root { --yego-blue: #002d5a; --yego-green: #27ae60; }
        body { background: #f4f6f9; font-size: 0.82rem; }
        .section-header { background: var(--yego-blue); color: white; padding: 8px 15px; margin-top: 15px; font-weight: bold; border-left: 5px solid var(--yego-green); }
        .card-body { background: white; border: 1px solid #ddd; padding: 15px; }
        .table-danger { background-color: #f8d7da !important; }
        .table-warning { background-color: #fff3cd !important; }
    </style>
</head>
<body>

<nav class="navbar navbar-dark bg-dark p-2">
    <div class="container-fluid">
        <span class="navbar-brand">YEGO LOGÍSTICA - CONTROL TOTAL</span>
        <div>
            <button class="btn btn-outline-info btn-sm me-2" onclick="cambiarClaveAdmin()">🔐 CLAVE</button>
            <button class="btn btn-success btn-sm" onclick="limpiarForm()">🆕 NUEVO</button>
        </div>
    </div>
</nav>

<div class="container-fluid mt-3">
    <div class="row g-2 mb-3 bg-white p-3 shadow-sm border">
        <div class="col-md-7"><input type="text" id="q" class="form-control" placeholder="Buscar Placa o Cédula..."></div>
        <div class="col-md-2"><button class="btn btn-primary w-100" onclick="consultar()">BUSCAR</button></div>
        <div class="col-md-3"><button class="btn btn-warning w-100 fw-bold" onclick="guardar()">GUARDAR / ACTUALIZAR</button></div>
    </div>

    <form id="formYego">
        <div class="row">
            <div class="col-md-4">
                <div class="section-header">I. VEHÍCULO Y GPS</div>
                <div class="card-body row g-2">
                    <div class="col-6"><label>PLACA</label><input type="text" id="v_placa" class="form-control"></div>
                    <div class="col-6"><label>VENC. SOAT</label><input type="date" id="v_soat" class="form-control"></div>
                    <div class="col-6"><label>VENC. TECNO</label><input type="date" id="v_tecno" class="form-control"></div>
                    <div class="col-6"><label>PROVEEDOR GPS</label><input type="text" id="v_gps_prov" class="form-control"></div>
                    <div class="col-12"><label>USUARIO GPS</label><input type="text" id="v_gps_user" class="form-control"></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="section-header">II. CONDUCTOR / SEGURIDAD</div>
                <div class="card-body row g-2">
                    <div class="col-12"><label>NOMBRE</label><input type="text" id="c_nom" class="form-control"></div>
                    <div class="col-6"><label>CÉDULA</label><input type="text" id="c_cc" class="form-control"></div>
                    <div class="col-6"><label>VENC. LICENCIA</label><input type="date" id="c_venc_lic" class="form-control"></div>
                    <div class="col-12"><label class="text-danger fw-bold">VENC. PLANILLA</label><input type="date" id="c_venc_planilla" class="form-control border-danger"></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="section-header">III. PROPIETARIOS / TENEDORES</div>
                <div class="card-body row g-2">
                    <div class="col-12"><label>NOMBRE TENEDOR</label><input type="text" id="t_nom" class="form-control"></div>
                    <div class="col-12"><label>CORREO TENEDOR</label><input type="email" id="t_correo" class="form-control"></div>
                    <div class="col-12"><label>NOMBRE PROPIETARIO</label><input type="text" id="p_nom" class="form-control"></div>
                    <div class="col-12"><label>CORREO PROPIETARIO</label><input type="email" id="p_correo" class="form-control"></div>
                </div>
            </div>
        </div>
    </form>

    <div class="section-header mt-4">IV. INVENTARIO GENERAL (CONTROL DE VENCIMIENTOS)</div>
    <div class="card-body p-0 shadow-sm">
        <table class="table table-sm table-hover mb-0">
            <thead class="table-dark">
                <tr>
                    <th>PLACA</th><th>CONDUCTOR</th><th>SOAT</th><th>TECNO</th><th>PLANILLA</th><th class="text-center">ACCIONES</th>
                </tr>
            </thead>
            <tbody id="tablaVehiculos" class="fw-bold"></tbody>
        </table>
    </div>
</div>

<script>
    // --- Lógica de Negocio ---
    window.onload = listar;

    function getClase(f) {
        if(!f) return "";
        const d = (new Date(f) - new Date()) / 86400000;
        return d < 0 ? "table-danger" : (d <= 10 ? "table-warning" : "");
    }

    async function listar() {
        const res = await fetch('/listar');
        const db = await res.json();
        document.getElementById('tablaVehiculos').innerHTML = db.map(v => `
            <tr>
                <td class="ps-2">${v.v.placa}</td>
                <td>${v.c.nom}</td>
                <td class="${getClase(v.v.soat)}">${v.v.soat || ''}</td>
                <td class="${getClase(v.v.tecno)}">${v.v.tecno || ''}</td>
                <td class="${getClase(v.c.venc_planilla)}">${v.c.venc_planilla || ''}</td>
                <td class="text-center">
                    <button class="btn btn-primary btn-sm" onclick="cargar('${v.v.placa}')">VER</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminar('${v.v.placa}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    async function guardar() {
        const d = {
            v: { placa: val('v_placa').toUpperCase(), soat: val('v_soat'), tecno: val('v_tecno'), gps_prov: val('v_gps_prov'), gps_user: val('v_gps_user') },
            c: { nom: val('c_nom'), cc: val('c_cc'), venc_lic: val('c_venc_lic'), venc_planilla: val('c_venc_planilla') },
            t: { nom: val('t_nom'), correo: val('t_correo') },
            p: { nom: val('p_nom'), correo: val('p_correo') }
        };
        await fetch('/guardar', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d) });
        alert("✅ Información Unificada y Guardada");
        listar();
    }

    async function eliminar(p) {
        const pw = prompt("Clave admin:");
        const res = await fetch(`/eliminar/${p}`, { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({clave: pw}) });
        if(res.ok) { alert("Eliminado"); listar(); } else alert("Clave incorrecta");
    }

    async function consultar() {
        const res = await fetch(`/consultar/${val('q')}`);
        if(res.ok) {
            const d = await res.json();
            set('v_placa', d.v.placa); set('v_soat', d.v.soat); set('v_tecno', d.v.tecno); set('v_gps_prov', d.v.gps_prov); set('v_gps_user', d.v.gps_user);
            set('c_nom', d.c.nom); set('c_cc', d.c.cc); set('c_venc_lic', d.c.venc_lic); set('c_venc_planilla', d.c.venc_planilla);
            set('t_nom', d.t.nom); set('t_correo', d.t.correo); set('p_nom', d.p.nom); set('p_correo', d.p.correo);
        } else alert("No encontrado");
    }

    function val(id) { return document.getElementById(id).value; }
    function set(id, v) { document.getElementById(id).value = v || ''; }
    function limpiarForm() { document.getElementById('formYego').reset(); }
    function cargar(p) { document.getElementById('q').value = p; consultar(); window.scrollTo(0,0); }

    async function cambiarClaveAdmin() {
        const a = prompt("Clave actual:");
        const n = prompt("Nueva clave:");
        const res = await fetch('/cambiar-clave', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({claveActual: a, claveNueva: n}) });
        const data = await res.json(); alert(data.mensaje || data.error);
    }
</script>
</body>
</html>
