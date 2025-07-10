import Header from "@/components/Header";
import MainDisplay from "@/components/MainDisplay";
import { createClient } from "@/utils/supabase/server";

export default async function Submit() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const userData = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      {/*@ts-ignore*/}
      <Header user={userData} />
      <MainDisplay user={userData} post={true} />
    </>
  );
}
