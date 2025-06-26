import { create } from "zustand";
import {
  BuscarUsuarios,
  EditarUsuarios,
  EliminarPermisos,
  EliminarUsuarios,
  InsertarAsignaciones,
  InsertarPermisos,
  InsertarUsuarios,
  MostrarModulos,
  MostrarPermisos,
  MostrarUsuarios,
  MostrarUsuariosTodos,
} from "../supabase/crudUsuarios";
import { DataModulosConfiguracion } from "../utils/dataEstatica";
import { supabase } from "../supabase/supabase.config";

export const useUsuariosStore = create((set, get) => ({
  datamodulos: [],
  idusuario: 0,
  perfilUsuario: null,
  isEditProfileOpen: false,
  buscador: "",
  datausuarios: [],
  usuariosItemSelect: [],
  parametros: {},
  datapermisos: [],
  datapermisosEdit: [],

  // Funciones para manejar el estado del modal de edición de perfil
  openEditProfile: () => set({ isEditProfileOpen: true }),
  closeEditProfile: () => set({ isEditProfileOpen: false }),

  setBuscador: (p) => {
    set({ buscador: p });
  },

  insertarUsuarioAdmin: async (p) => {
    const { data, error } = await supabase.auth.signUp({
      email: p.correo,
      password: p.pass,
    });

    if (error) return;

    const datauser = await InsertarUsuarios({
      idauth: data.user.id,
      fecharegistro: new Date(),
      tipouser: "superadmin",
    });
    return datauser;
  },

  // Función corregida y unificada para mostrar el usuario logueado
  mostrarUsuarios: async () => {
    const response = await MostrarUsuarios();
    if (response) {
      set({ idusuario: response.id });
      set({ perfilUsuario: response }); // Guarda el perfil completo
    }
    return response;
  },

  mostrarusuariosTodos: async (p) => {
    const response = await MostrarUsuariosTodos(p);
    set({ parametros: p });
    set({ datausuarios: response });
    set({ usuariosItemSelect: response[0] });
    return response;
  },

  selectusuarios: (p) => {
    set({ usuariosItemSelect: p });
  },

  insertarusuarios: async (parametrosAuth, p, datacheckpermisos) => {
    const { data, error } = await supabase.auth.signUp({
      email: parametrosAuth.correo,
      password: parametrosAuth.pass,
    });

    if (error) {
      return null;
    }

    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      nro_doc: p.nrodoc,
      telefono: p.telefono,
      direccion: p.direccion,
      fecharegistro: new Date(),
      estado: "activo",
      idauth: data.user.id,
      tipouser: p.tipouser,
      tipodoc: p.tipodoc,
      correo: p.correo,
    });

    await InsertarAsignaciones({
      id_empresa: p.id_empresa,
      id_usuario: dataUserNew.id,
    });

    for (const item of datacheckpermisos) {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: dataUserNew.id,
          idmodulo: item.id,
        };
        await InsertarPermisos(parametrospermisos);
      }
    }
    await supabase.auth.signOut();
  },

  eliminarusuarios: async (p) => {
    await EliminarUsuarios(p);
    const { mostrarusuariosTodos, parametros } = get();
    set(mostrarusuariosTodos(parametros));
  },

  editarusuarios: async (p, datacheckpermisos, idempresa) => {
    await EditarUsuarios(p);
    await EliminarPermisos({ id_usuario: p.id });

    for (const item of datacheckpermisos) {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: p.id,
          idmodulo: item.id,
        };
        await InsertarPermisos(parametrospermisos);
      }
    }

    const { mostrarusuariosTodos } = get();
    set(mostrarusuariosTodos({ _id_empresa: idempresa }));
  },

  buscarusuarios: async (p) => {
    const response = await BuscarUsuarios(p);
    set({ datausuarios: response });
    return response;
  },

  mostrarModulos: async () => {
    const response = await MostrarModulos();
    set({ datamodulos: response });
    return response;
  },

  mostrarpermisos: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisos: response });

    let allDocs = DataModulosConfiguracion.map((element) => {
      const statePermiso = response.some((objeto) =>
        objeto.modulos.nombre.includes(element.title)
      );
      return { ...element, state: statePermiso };
    });

    // Reemplaza el contenido del array original de forma segura
    DataModulosConfiguracion.splice(0, DataModulosConfiguracion.length, ...allDocs);

    return response;
  },

  mostrarpermisosEdit: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisosEdit: response });
    return response;
  },
}));