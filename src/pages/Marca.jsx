import { useQuery } from "@tanstack/react-query";
import { MarcaTemplate } from "../components/templates/MarcaTemplate";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMarcaStore } from "../store/MarcaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina"

export function Marca() {
  const { datapermisos } = useUsuariosStore();
  const statePermiso = datapermisos.some((objeto) => objeto.modulos.nombre.includes("Marca de productos"))
  const { mostrarMarca, datamarca, buscarMarca, buscador } = useMarcaStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar marca", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarMarca({ id_empresa: dataempresa?.id }),
    enabled: dataempresa?.id != null,
  });
  const { data: buscardata } = useQuery({
    queryKey: [
      "buscar marca",
      { id_empresa: dataempresa.id, descripcion: buscador },
    ],
    queryFn: () =>
      buscarMarca({ id_empresa: dataempresa.id, descripcion: buscador }),
    enabled: dataempresa.id != null,
  });
  if (statePermiso == false) {
    return <BloqueoPagina />;
  }
  if (isLoading) {
    return <SpinnerLoader />;
  }
  if (error) {
    return <span>Error...</span>;
  }

  return <MarcaTemplate data={datamarca} />;
}