<?php
namespace app\commands;

use pmill\Chat\BasicMultiRoomServer;
use yii\console\Controller;

class ServerController extends Controller
{
    public function actionStart($port = null)
    {

        $port = 9911;
        $server = new BasicMultiRoomServer();

        BasicMultiRoomServer::run($server, $port);
    }
}