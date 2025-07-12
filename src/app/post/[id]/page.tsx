import Header from "@/components/Header";
import MainDisplay from "@/components/MainDisplay";
import { createClient } from "@/utils/supabase/server";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
      <MainDisplay user={userData} type={"post"} postID={id} />
    </>
  );
}
