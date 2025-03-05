import { request, response } from "sdk/http";

const teest = request.getScheme() + "//:" + request.getServerName() + ":" + request.getServerPort();

response.println(teest);